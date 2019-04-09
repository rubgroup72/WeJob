using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace JobsAlgo
{
    class Program
    {
        static object locker = new object(); //רושם לדטא בייס thread יצירת אובייקט נעילה בזמן ש
        static int finishAmount = 0; // כבר נרשמו לדטא בייס (threads) משתנה ששומר כמה חוטים
        static List<TagsPair> finalTagPairList = new List<TagsPair>(); //יצירת ליסט שישמור את כל התגיות הסופיות שנכניס לדטא בייס
        static int amountOfThreads = 40; //שנריץ. נבחר שרירותית 40 threads כמות ה

        static void Main(string[] args)
        {
            List<List<string>> questions = GetAllQuestions();  //ליסט של שאלות
            List<string> tags = GetAllTags(questions); // ליסט של תגיות
            var amountOfTagsInThread = 250; // מספר התגיות שכל חוט הולך לטפל בהם. מטעמי זמן ריצה וזכרון נבחר שרירותית 250
            for (var i = 0; i < amountOfThreads; ++i)
            {
                if (i == amountOfThreads - 1) // האחרון thread אם אנחנו נמצאים ב 
                    (new Thread(() => BuildTagsPairListImprove(questions, tags, i * amountOfTagsInThread, tags.Count()))).Start();
                else//  אחר שאינו האחרון thread אם אנחנו נמצאים בכל
                    (new Thread(() => BuildTagsPairListImprove(questions, tags, i * amountOfTagsInThread, (i + 1) * amountOfTagsInThread))).Start();
            }
            Console.ReadLine();
        }
        //פונקציה שמחזיר רשימה של כל השאלות כשבתוך כל שאלה רשימה של תגיות
        static List<List<string>> GetAllQuestions()
        {
            string[] lines = System.IO.File.ReadAllLines(@"C:\Users\Inga\source\repos\JobsAlgo\JobsAlgo\AllTags.txt");
            List<List<string>> returnList = new List<List<string>>();
            foreach (string line in lines)
            {
                List<string> tagsInQuestions = new List<string>(); //יצירת רשימה של תגיות בכל שאלה
                var tempTagsList = line.Split(','); // לוקחים את השורה ומחלקים למילים לפי פסיקים
                tagsInQuestions = tempTagsList.Take(tempTagsList.Count() - 1).ToList();//מוותרים על האיבר הריק שאחרי הפסיק האחרון
                returnList.Add(tagsInQuestions);//מכניסים לתוך רשימה שיצרנו מקודם
            }
            return returnList;
        }

        //פונקציה שמחזירה רשימה של כל התגיות האפשריות
        static List<string> GetAllTags(List<List<string>> questions)
        {
            List<string> tagsList = new List<string>();
            foreach (List<string> question in questions) //לולאה שעוברת על כל השאלות
            {
                foreach (string tag in question)//לולאה שעוברת על כל התגיות בכל שאלה
                {
                    if (!tagsList.Contains(tag))//אם התג לא נמצא ברשימה נוסיף אותו
                    {
                        tagsList.Add(tag);
                    }
                }
            }
            return tagsList;
        }

        //מחזירים את כל צמדי התגיות האפשריים ואת אחוזי ההופעה שלהם
        static void BuildTagsPairListImprove(List<List<string>> questionsList, List<string> tags, int start, int end)
        {
            List<TagsPair> tagsPairList = new List<TagsPair>();
            for (int i = start; i < end; i++)
            {
                string firstTag = tags[i];
                for (int j = 0; j < tags.Count; j++)
                {
                    string secondTag = tags[j];
                    if (i >= j)
                    {
                        continue;
                    }
                    int bothTagsAppear = 0; 
                    int atLeastOneTagAppear = 0;

                    foreach (var question in questionsList)// עוברים על כל שאלה ברשימת השאלות
                    {
                        //כאן אנחנו בונים את המכנה - אם בשאלה לפחות אחת מ 2 התגיות מופיעה נעשה למכנה +1
                        if (question.Any(t => t == firstTag || t == secondTag))
                        {
                            atLeastOneTagAppear++;
                        }
                        //כאן אנחנו בונים את הסטטיסטיקה לתגיות - אם שתיהן מופיעות בשאלה נעשה +1 
                        if (question.Any(t => t == firstTag) && question.Any(t => t == secondTag))
                        {
                            bothTagsAppear++; 
                        }
                    }

                    if (bothTagsAppear == 0)// בהנחה ו2 התגיות לא מופיעות ביחד בשום שאלה לא נרצה להכניס אותן לדטא בייס כי אחוז ההתאמה הוא אפס
                        continue;

                    TagsPair tp = new TagsPair(); //יצירת אובייקט מסוג "זוג תגיות" שיכיל את הזוג הנבדק
                    tp.FirstTag = firstTag;
                    tp.SecondTag = secondTag;
                    tp.AtLeastOneTagAppear = atLeastOneTagAppear;
                    tp.BothTagsAppear = bothTagsAppear;
                    tp.MatchPercent = (double)bothTagsAppear / atLeastOneTagAppear; // חישוב אחוז ההתאמה
                    tagsPairList.Add(tp);// הוספת האובייקט לרשימה של כל האובייקטים
                }
            }
            //נועלת את הכתיבה לליסט הסופי כאשר חוט מסויים רושם לתוכו כרגע
            lock (locker)
            {
                finalTagPairList.AddRange(tagsPairList);
                finishAmount++;
                Console.WriteLine(finishAmount);
                if (finishAmount == amountOfThreads)
                    WriteToDB(finalTagPairList);
            }
        }

        // כתיבה לDB
        static void WriteToDB(List<TagsPair> tagsListPair)
        {
            SqlConnection con = null;

            try
            {
                con = connect();
                String selectSTR = "Insert Into [TagsMatchPerecent] ([FirstTag], [SecondTag], [AtLeastOneTagAppear],[BothTagsAppear],[MatchPercent]) ";
                selectSTR += "Values ";
                for (var i = 0; i < tagsListPair.Count(); ++i)
                {
                    var tp = tagsListPair[i];
                    if (i == tagsListPair.Count - 1) // האחרון thread בהנחה והגענו לכתיבה של ה
                        selectSTR += String.Format(" ('{0}','{1}',{2},{3},{4}); ", tp.FirstTag, tp.SecondTag, tp.AtLeastOneTagAppear, tp.BothTagsAppear, tp.MatchPercent);
                    else //האחרון thread בהנחה ולא הגענו לכתיבה של ה
                        selectSTR += String.Format(" ('{0}','{1}',{2},{3},{4}), ", tp.FirstTag, tp.SecondTag, tp.AtLeastOneTagAppear, tp.BothTagsAppear, tp.MatchPercent);
                }
                var cmd = CreateCommand(selectSTR, con);
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        private static SqlCommand CreateCommand(String CommandSTR, SqlConnection con)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = CommandSTR;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.Text; // the type of the command, can also be stored procedure

            return cmd;
        }
        public static SqlConnection connect()
        {
            // read the connection string from the configuration file
            string cStr = "Data Source=Media.ruppin.ac.il; Initial Catalog=bgroup72_prod; User ID=bgroup72; Password=bgroup72_30532";
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }
    }

    //קלאס שמחזיק זוג תגיות
    class TagsPair
    {
        public string FirstTag { get; set; }
        public string SecondTag { get; set; }
        public int AtLeastOneTagAppear { get; set; }
        public int BothTagsAppear { get; set; }
        public double MatchPercent { get; set; }

    }
}
