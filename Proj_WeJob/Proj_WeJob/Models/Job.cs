using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Proj_WeJob.Models.DAL
{
    public class Job
    {
        public static string JOB_STATUS_NEW = "new";
        public static string JOB_STATUS_DELETE = "delete";
        public static string JOB_STATUS_SAVED = "save";
        public static string JOB_STATUS_SAVED_AND_SENT_CV = "save and cv";
        public static string JOB_STATUS_SENT_CV = "send cv";

        //Propeties 
        public int JobNo { get; set; }
        public string JobName { get; set; }
        public string JobDescription { get; set; }
        public string Requirements { get; set; }
        public int CompanyCompanyNo { get; set; }
        public string MailForCV { get; set; }
        public DateTime OpenDate { get; set; }
        public DateTime ToDate { get; set; }
        public string JobStatusStatusName { get; set; }
        public string Link { get; set; }
        public string Location { get; set; }
        public string Status { get; set; }
        public int CategoryNo { get; set; }
        //public List<String> ArrayIntrests { get; set; }
        public List<String> ArrayLanguage { get; set; }
        public List<String> ArraySkill { get; set; }
        public List<String> ArraySubCategory { get; set; }
        public List<string> JobTitlesList { get; set; }
        public int AmountSend { get; set; }
        public string CategoryName { get; set; }
        public int CompanyNo { get; set; }
        public string CompanyName { get; set; }
        public string ContactName { get; set; }
        public int ContactPhone { get; set; }
        public string ContactMail { get; set; }
        public bool IsFromSmartAlgo { get; set; }
        public bool IsSaved { get; set; }
        public String StudentJobStatus { get; set; }

        //constructor
        public Job(int JobNo,string JobName, string JobDescription, string Requirements,
            int CompanyCompanyNo, string MailForCV, DateTime OpenDate, DateTime ToDate,
            string JobStatusStatusName, string Link, List<String> ArrayLanguage, List<String> ArraySkill, List<String> ArraySubCategory,
            string Location,string Status, int CategoryNo, List <string> JobTitlesList,int AmountSend,
            string CategoryName, int CompanyNo, string CompanyName, string ContactName, int ContactPhone, string ContactMail)
        {
            this.CompanyCompanyNo = CompanyCompanyNo;
            this.JobNo = JobNo;
            this.JobName = JobName;
            this.JobDescription = JobDescription;
            this.Requirements = Requirements;
            this.MailForCV = MailForCV;
            this.OpenDate = OpenDate;
            this.ToDate = ToDate;
            this.JobStatusStatusName = JobStatusStatusName;
            this.Link = Link;
            this.Location = Location;
            this.Status = Status;
            this.CategoryNo = CategoryNo;
            //this.ArrayIntrests = ArrayIntrests;
            this.ArrayLanguage = ArrayLanguage;
            this.ArraySkill = ArraySkill;
            this.ArraySubCategory = ArraySubCategory;
            this.JobTitlesList = JobTitlesList;
            this.AmountSend = AmountSend;
            this.CategoryName = CategoryName;
            this.CompanyNo = CompanyNo;
            this.CompanyName = CompanyName;
            this.ContactName = ContactName;
            this.ContactPhone = ContactPhone;
            this.ContactMail = ContactMail;


        }

        public Job()
        {
            this.ArrayLanguage = new List<String>();
            this.ArraySkill = new List<String>();
            this.ArraySubCategory= new List<String>();
        }

        //הכנסת נתונים לטבלה באמצעות קשירה לDB
        public int InsertJob()
        {
            DBservices dbs = new DBservices();
            int num1 = dbs.InsertJob(this);
            int num2 = dbs.Insert_JobSkill(this, num1);
            //int num3 = dbs.Insert_JobInterst(this, num1);
            int num4 = dbs.Insert_JobLanguage(this, num1);
            int num5 = dbs.Insert_JobSubCategory(this, num1);

            SendPushNotification(this, num1);

            return (num1 & num2 & num4 & num5);
            //return (num1 & num5);
        }
        public int updateStatusJob()
        {
            DBservices dbs = new DBservices();
            return dbs.updateStatusJob(this);
        }
        //החזרת משרות של מפיץ ספציפי
        public List<Job> GetListJobsOfDistributor(string companyNo)
        {
            DBservices dbs = new DBservices();
            return dbs.GetListJobsOfDistributor("DBConnectionString", companyNo);
        }
        public Job GetJob(string JobNo)
        {
            DBservices dbs = new DBservices();
            return dbs.GetJob("DBConnectionString", JobNo);
        }
        public int GetAmountJobsGood()
        {
            DBservices db = new DBservices();
            return db.GetAmountJobsGood("DBConnectionString");
        }
        public int GetAmountJobsBad()
        {
            DBservices db = new DBservices();
            return db.GetAmountJobsBad("DBConnectionString");
        }
       public List<Job> GetPopularJobs()
        {
            DBservices db = new DBservices();
            return db.GetPopularJobs("DBConnectionString");
        }
        //לאפליקציה - מביאה משרות לפי מספר קטגוריה
        public List<Job> GetListJobNames(int CategoryNo)
        {
            DBservices dbs = new DBservices();
            return dbs.GetListJobNames(CategoryNo);
        }

        public List<Job> GetHotJobsByCategoryNo(string CategoryNo)
        {
            DBservices dbs = new DBservices();
            return dbs.GetHotJobsByCategoryNo(CategoryNo);
        }
        public List<Job> GetreportJobs()
        {
            DBservices dbs = new DBservices();
            return dbs.GetreportJobs("DBConnectionString");
        }

        //לאפליקציה - מביאה משרות לפי תגיות נבחרות ושמות של משרות
        public List<Job> GetListOfJobs(string studentId)
        {
            DBservices dbs = new DBservices();
            var retList = dbs.GetListOfJobs(studentId);
            var jobNoList = retList.Select(i => i.JobNo).ToList();
            var studentTags = dbs.GetStudentSelectedTags(studentId).Select(i => i.SubCategoryNo);
            var studentDirectJobs = dbs.GetStudentDirectJobs(studentId);
            var studentJobStatus = dbs.GetStudentJobStatus(studentId, jobNoList);

            var newJobs = new List<int>();
            foreach (var job in jobNoList)
            {
                var mainJob = retList.First(i => i.JobNo == job);
                if (!studentJobStatus.ContainsKey(job))
                {
                    newJobs.Add(job);
                    mainJob.StudentJobStatus = JOB_STATUS_NEW;
                    continue;
                }
                mainJob.StudentJobStatus = studentJobStatus[job];
                //if (studentJobStatus[job] == JOB_STATUS_DELETE || studentJobStatus[job] == JOB_STATUS_SENT_CV || studentJobStatus[job] == JOB_STATUS_SAVED_AND_SENT_CV)
                //{
                //    retList.Remove(retList.First(i => i.JobNo == job));
                //    continue;
                //}
                if (studentJobStatus[job] == JOB_STATUS_SAVED)
                {
                    retList.First(i => i.JobNo == job).IsSaved = true;
                }
            }

            if (newJobs.Count() > 0)
            {
                dbs.AddNewStudentJobStatus(studentId, newJobs);
            }

            // IsFromAlgo
            foreach (var job in retList)
            {
                if (studentDirectJobs.Contains(job.JobNo))
                {
                    job.IsFromSmartAlgo = false;
                    continue;
                }

                bool hasAtLeastOneTag = false;
                var jobTags = dbs.GetTagsByJobId(job.JobNo).Select(i => i.SubCategoryNo);
                foreach (var t in jobTags)
                {
                    if (studentTags.Contains(t))
                    {
                        hasAtLeastOneTag = true;
                        break;
                    }
                }
                job.IsFromSmartAlgo = !hasAtLeastOneTag;
            }
            return retList;
        }
        public string UpdateStudentJob(string studnetId, string jobId, string status)
        {
            if (status != JOB_STATUS_DELETE && status != JOB_STATUS_NEW && status != JOB_STATUS_SAVED &&
                status != JOB_STATUS_SAVED_AND_SENT_CV && status != JOB_STATUS_SENT_CV)
                return "Invliad status";
            DBservices dbs = new DBservices();

            if (status == JOB_STATUS_SENT_CV || status == JOB_STATUS_SAVED_AND_SENT_CV)
            {
                var t = new Student();
                var student = t.GetListStudent(studnetId).First();
                if (String.IsNullOrEmpty(student.CVName))
                {
                    return "No cv";
                }
            }

            dbs.UpdateStudentJobStatus(studnetId, jobId, status);

            // TODO - send CV

            return "";
        }

        public void SendPushNotification(Job newJob, int jobId)
        {
            Student s = new Student();
            var relevantStudentList = new List<String>();
            foreach (Student student in s.GetListStudent())
            {
                var studentJobsList = GetListOfJobs(student.StudentId.ToString());
                if (studentJobsList.Any(i => i.JobNo == jobId))
                {
                    relevantStudentList.Add(student.StudentId.ToString());
                }
            }

            if (relevantStudentList.Count() > 0)
            {
                DBservices dbs = new DBservices();
                var companiesList = dbs.GetListDistributor();
                var companyName = companiesList.FirstOrDefault(i => i.CompanyNo == newJob.CompanyCompanyNo)?.NameCompany;
                var title = "משרה חדשה";
                var body = String.Format("{0} מחפשת {1}.. חשבנו שזה עשוי לעניין אותך", companyName, newJob.JobName);
                foreach (var token in dbs.GetStudentDeviceId(relevantStudentList))
                {
                    PushNotification.SendPushNotification(title, body, token);
                }
            }
        }

    }
}