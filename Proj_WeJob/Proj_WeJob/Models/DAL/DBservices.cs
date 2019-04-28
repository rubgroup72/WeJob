﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Data;
using System.Text;
using Proj_WeJob.Models;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;


namespace Proj_WeJob.Models.DAL
{
    public class DBservices
    {
        //connection string details
        private String connectionString = "DBConnectionString";

        public DBservices()
        {
            //
            // TODO: Add constructor logic here
            //
        }
        //--------------------------------------------------------------------------------------------------
        // This method creates a connection to the database according to the connectionString name in the web.config 
        //--------------------------------------------------------------------------------------------------
        public SqlConnection connect(String conString)
        {
            // read the connection string from the configuration file
            string cStr = WebConfigurationManager.ConnectionStrings[conString].ConnectionString;
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }
        //--------------------------------------------------------------------------------------------------
        // This method inserts a person to the persons table 
        //--------------------------------------------------------------------------------------------------
        private SqlCommand CreateCommand(String CommandSTR, SqlConnection con)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = CommandSTR;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.Text; // the type of the command, can also be stored procedure

            return cmd;
        }

        ///+++++++++הוספת מפיץ חדש++++++++++++++++++
        public int InsertDistibutor(Distributor distributor)
        {
            SqlConnection con;
            SqlCommand cmd;
            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            String cStr = BuildInsertDistributor(distributor);      // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command
            try
            {
                return Convert.ToInt32(cmd.ExecuteScalar());
                //int numEffected = cmd.ExecuteNonQuery(); // execute the command
            }
            catch (Exception ex)
            {
                return 0;
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }
        //--------------------------------------------------------------------
        // Build the Insert a movie command String
        //--------------------------------------------------------------------
        private String BuildInsertDistributor(Distributor dis)
        {
            String command;
            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            sb.AppendFormat("Values('{0}','{1}','{2}','{3}')",dis.NameCompany,dis.NamePerson,dis.Phone,dis.Email);
            String prefix = "INSERT INTO Company " + "(CompanyName,ContactName,ContactPhone,ContactMail) ";
            command = prefix + sb.ToString();
            command += "; SELECT SCOPE_IDENTITY()";
            return command;
        }
        ///++++++++++סיום הוספת משתמש+++++++++++

        ///+++++++++הוספת משרה++++++++++++++++++
        public int InsertJob(Job job)
        {
            SqlConnection con;
            SqlCommand cmd;
            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            String cStr = BuildInsertJob(job);      // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command
            try
            {
                int numEffected = Convert.ToInt32(cmd.ExecuteScalar());
                //int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected;
            }
            catch (Exception ex)
            {
                return 0;
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }
        private String BuildInsertJob(Job job)
        {
            String command;
            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            sb.AppendFormat("Values('{0}','{1}','{2}',{3},'{4}','{5}','{6}','{7}','{8}','{9}')", job.JobName, job.JobDescription, job.Requirements, Convert.ToInt32(job.CompanyCompanyNo), job.Location,job.MailForCV ,job.OpenDate, job.ToDate,job.Status,job.Link);
            String prefix = "INSERT INTO Job " + "(JobName,JobDescription,Requirements,CompanyCompanyNo,Location,MailForCV,OpenDate,ToDate,JobStatusStatusName,Link) ";
            command = prefix + sb.ToString();
            command += "; SELECT SCOPE_IDENTITY()";
            return command;
        }
        ///+++++++++הוספת תחומי עניין למשרה++++++++++
        public int Insert_JobInterst( Job job, int id)
        {
            SqlConnection con;
            SqlCommand cmd;
            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            String cStr = BuildInsert_JobInterst(job, id);      // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command
            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected;
            }
            catch (Exception ex)
            {
                return 0;
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }
        private String BuildInsert_JobInterst(Job job, int id)
        {
            String command = "";
            String prefix;
            // use a string builder to create the dynamic string
            for (int i = 0; i < job.ArrayIntrests.Count; i++)
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat("Values({0},'{1}')", id.ToString(), job.ArrayIntrests[i]);
                prefix = "INSERT INTO bgroup72_prod.dbo.Job_Intrests (JobJobNo,IntrestsIntrestName)";
                command = command + prefix + sb.ToString() + ";";
            }
            return command;
        }
        //++++++++++++סיום הוספת תחומי עניין למשרה +++++++++


        //+++++פונקציה שמחזיה רשימה של מפיצים ללא סינון

        ///+++++++++הוספת שפות למשרה++++++++++
        public int Insert_JobLanguage(Job job, int id)
        {
            SqlConnection con;
            SqlCommand cmd;
            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            String cStr = BuildInsert_JobLanguage(job,id);      // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command
            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected;
            }
            catch (Exception ex)
            {
                return 0;
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }
        private String BuildInsert_JobLanguage(Job job, int id)
        {
            String command = "";
            String prefix;
            // use a string builder to create the dynamic string
            for (int i = 0; i < job.ArrayLanguage.Count; i++)
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat("Values({0},'{1}',{2})", id.ToString(), job.ArrayLanguage[i],1);
                prefix = "INSERT INTO bgroup72_prod.dbo.Job_Language(JobJobNo,LanguageLangName,Degree)";
                command = command + prefix + sb.ToString() + ";";
            }
            return command;
        }
        //++++++++++++סיום הוספת שפות למשרה +++++++++

        ///+++++++++הוספת כישורים למשרה++++++++++
        public int Insert_JobSkill(Job job, int id)
        {
            SqlConnection con;
            SqlCommand cmd;
            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            String cStr = BuildInsert_JobSkill(job, id);      // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command
            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected;
            }
            catch (Exception ex)
            {
                return 0;
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }
        private String BuildInsert_JobSkill(Job job, int id)
        {
            String command = "";
            String prefix;
            // use a string builder to create the dynamic string
            for (int i = 0; i < job.ArraySkill.Count; i++)
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat("Values({0},{1})", id.ToString(), job.ArraySkill[i]);
                prefix = "INSERT INTO bgroup72_prod.dbo.Job_Skill(JobJobNo,SkillSkillNo)";
                command = command + prefix + sb.ToString() + ";";
            }
            return command;
        }
        //++++++++++++סיום הוספת שפות למשרה +++++++++
        //+++++פונקציה שמחזיה רשימה של מפיצים ללא סינון

        public List<Distributor> GetListDistributor(string conString)
        {
            SqlConnection con = null;
            List<Distributor> ld = new List<Distributor>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT * FROM Company";
                SqlCommand cmd = new SqlCommand(selectSTR, con);
                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {   // Read till the end of the data into a row
                    Distributor d = new Distributor
                        (
                        Convert.ToInt32(dr["CompanyNo"]),
                        Convert.ToString(dr["CompanyName"]),
                        Convert.ToString(dr["ContactName"]),
                        Convert.ToString(dr["ContactPhone"]),
                        Convert.ToString(dr["ContactMail"])
                       
                        );
                    ld.Add(d);
                }

                return ld;
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
     
        //+++++פונקציה שמחזיה רשימה של סטודנטים ללא סינון
        public List<Student> GetListStudent(string conString)
        {
            SqlConnection con = null;
            List<Student> ld = new List<Student>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT * FROM Student S Left Join Department D on S.DepartmentDepartmentCode = D.DepartmentCode Left Join Department_SubDepartment SD on S.SubDepartmentCode = SD.SubDepartmentId";
                SqlCommand cmd = new SqlCommand(selectSTR, con);
                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {   // Read till the end of the data into a row
                    Student s = new Student
                        (
                        Convert.ToInt32(dr["StudentID"]),
                        Convert.ToString(dr["FirstName"]),
                        Convert.ToString(dr["LastName"]),
                        Convert.ToString(dr["CellPhone"]),
                        Convert.ToString(dr["Email"]),
                        Convert.ToString(dr["Gender"]),
                        Convert.ToString(dr["DepartmentName"]),
                        Convert.ToString(dr["SubDepartmentName"])

                        );
                    ld.Add(s);
                }

                return ld;
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
        //החזרת כל הקטגוריות
        public List<Category> GetListCategory(string conString)
        {
            SqlConnection con = null;
            List<Category> ld = new List<Category>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT * FROM Category";
                SqlCommand cmd = new SqlCommand(selectSTR, con);
                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {   // Read till the end of the data into a row
                    Category c = new Category
                        (
                        Convert.ToInt32(dr["CategoryNo"]),
                        Convert.ToString(dr["CategoryName"]) 
                        );
                    ld.Add(c);
                }

                return ld;
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

        //החזרת תתי קטגוריות עבור קטגוריה שנבחרה
        public List<SubCategory> GetListSubCategory(string conString, string categoryNo)
        {
            SqlConnection con = null;
            List<SubCategory> ld = new List<SubCategory>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT * FROM SubCategory LEFT JOIN Category_SubCategory ON SubCategorySubCategoryNo=SubCategoryNo WHERE CategoryCategoryNo="+categoryNo;
                SqlCommand cmd = new SqlCommand(selectSTR, con);
                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {   // Read till the end of the data into a row
                    SubCategory c = new SubCategory
                        (
                        Convert.ToInt32(dr["SubCategoryNo"]),
                        Convert.ToString(dr["SubCategoryName"])
                        );
                    ld.Add(c);
                }

                return ld;
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
        //++++ פונקציית התחברות מאפליקציה לבסיס הנתונים
        public Student AppLogin(String email, String password)
        {
            SqlConnection con = null;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file
                var selectSTR = "SELECT * FROM Student S Left Join Department D on S.DepartmentDepartmentCode = D.DepartmentCode Left Join Department_SubDepartment SD on S.SubDepartmentCode = SD.SubDepartmentId Where email = '" + email + "' and Password = '" + password + "'";
                var cmd = new SqlCommand(selectSTR, con);
                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {   // Read till the end of the data into a row
                    Student s = new Student
                        (
                        Convert.ToInt32(dr["StudentID"]),
                        Convert.ToString(dr["FirstName"]),
                        Convert.ToString(dr["LastName"]),
                        Convert.ToString(dr["CellPhone"]),
                        Convert.ToString(dr["Email"]),
                        Convert.ToString(dr["Gender"]),
                        Convert.ToString(dr["DepartmentName"]),
                        Convert.ToString(dr["SubDepartmentName"])
                        );
                    return s;
                }
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
            return null;
        }

        //פונקציית הרשמה של סטודנט חדש
        public Student Register(String email, String firstName, String lastName, String phoneNumber, String password, String gender)
        {
            SqlConnection con = null;
            List<Student> currentStudentList = GetListStudent(connectionString);

            // Check if email already exists
            if (currentStudentList.Any(stud => stud.Email == email))
                return null;

            // Calc new studentId
            var studentId = currentStudentList.Count() + 1;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "Insert Into Student (StudentId, DepartmentDepartmentCode, FirstName,LastName,Email,CellPhone,Password,Gender) Values";
                selectSTR += String.Format("({0},{1},'{2}','{3}','{4}','{5}','{6}','{7}')", 
                    studentId, 0, firstName, lastName, email, phoneNumber, password, gender);
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
            return AppLogin(email, password);
        }

        //פונקציה שמחזירה רשימה של שפות 
        public List<Language> GetListLanguage(string conString)
        {
            SqlConnection con = null;
            List<Language> lp = new List<Language>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Language";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Language la = new Language
                    {
                       Name = Convert.ToString(dr["LangName"])
                    };
                    lp.Add(la);
                }

                return lp;
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

        //פונקציה שמחזירה רשימה של תחומי עניין 
        public List<Interst> GetListInterst(string conString)
        {
            SqlConnection con = null;
            List<Interst> inter = new List<Interst>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Intrests";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Interst i = new Interst
                    {
                        Name = Convert.ToString(dr["IntrestName"])
                    };
                    inter.Add(i);
                }

                return inter;
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

        //פונקציה שמחזירה רשימה של כישורים 
        public List<Skill> GetListSkill(string conString)
        {
            SqlConnection con = null;
            List<Skill> skills = new List<Skill>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Skill";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Skill s = new Skill
                    {
                        SkillNo=Convert.ToInt32(dr["SkillNo"]),
                        Name = Convert.ToString(dr["SkillName"])
                    };
                    skills.Add(s);
                }

                return skills;
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
    //פונקציה שמחזירה את המשרות של מפיץ ספציפי    
        public List<Job> GetListJobsOfDistributor(string conString,string companyNo)
        {
            SqlConnection con = null;
            List<Job> jobs = new List<Job>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT * FROM Job where Job.CompanyCompanyNo='" + companyNo+"'";
                //LEFT JOIN JobStatus ON Job.JobStatusStatusName = JobStatus.StatusName
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {   // Read till the end of the data into a row
                    Job j = new Job
                    {
                        JobNo = Convert.ToInt32(dr["JobNo"]),
                        JobName = Convert.ToString(dr["JobName"]),
                        OpenDate = Convert.ToDateTime(dr["OpenDate"]),
                        ToDate = Convert.ToDateTime(dr["ToDate"]),
                        Location = Convert.ToString(dr["Location"]),
                        Status = Convert.ToString(dr["JobStatusStatusName"]),
                    };
                    jobs.Add(j);
                }

                return jobs;
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

        //פונקציה שמחזירה את פרטי סטודנט ספציפי    
        public List<Student> GetListStudent(string conString, string StudentId)
        {
            SqlConnection con = null;
            List<Student> student = new List<Student>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file
                String cStr = "SELECT * FROM Student S Left Join Department D on S.DepartmentDepartmentCode = D.DepartmentCode Left Join Department_SubDepartment SD on S.SubDepartmentCode = SD.SubDepartmentId WHERE StudentId ='" + StudentId + "';";     // helper method to build the insert string
                //LEFT JOIN JobStatus ON Job.JobStatusStatusName = JobStatus.StatusName
                SqlCommand cmd = new SqlCommand(cStr, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {   // Read till the end of the data into a row
                    Student s = new Student
                          (
                          Convert.ToInt32(dr["StudentID"]),
                          Convert.ToString(dr["FirstName"]),
                          Convert.ToString(dr["LastName"]),
                          Convert.ToString(dr["CellPhone"]),
                          Convert.ToString(dr["Email"]),
                          Convert.ToString(dr["Gender"]),
                          Convert.ToString(dr["DepartmentName"]),
                          Convert.ToString(dr["SubDepartmentName"])
                          );
                    student.Add(s);
                }

                return student;
                ;
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



        //פונקציה שמחזירה את פרטי משרה מסוימת

        public Job GetJob(string conString, string JobNo)
        {
            SqlConnection con = null;
            Job job = new Job();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT * FROM Job where Job.JobNo='" + JobNo + "'";
                //LEFT JOIN JobStatus ON Job.JobStatusStatusName = JobStatus.StatusName
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {   // Read till the end of the data into a row
                    if (job != null)
                    {
                        Job j = new Job
                        {
                            JobNo = Convert.ToInt32(dr["JobNo"]),
                            JobName = Convert.ToString(dr["JobName"]),
                            JobDescription = Convert.ToString(dr["JobDescription"]),
                            Requirements = Convert.ToString(dr["Requirements"]),
                            MailForCV = Convert.ToString(dr["MailForCV"]),
                            Location = Convert.ToString(dr["Location"]),
                            OpenDate = Convert.ToDateTime(dr["OpenDate"]),
                            ToDate = Convert.ToDateTime(dr["ToDate"]),
                            Status = Convert.ToString(dr["JobStatusStatusName"]),
                            Link = Convert.ToString(dr["Link"]),
                        };
                        job = j;
                    }   
                }

                return job;
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

        //פונקציה שמעדכנת פרטי מפיץ לאחר שינוי
        public int UpdateDistributer(Distributor distributor)
        {
            SqlConnection con;
            SqlCommand cmd;
            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            String cStr = BuildUpdataCommand2(distributor);      // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command
            try
            {
                return cmd.ExecuteNonQuery(); // execute the command
                //return person.Id;
            }
            catch (Exception ex)
            {
                return 0;
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }
        private String BuildUpdataCommand2(Distributor dis)
        {
            String command;
            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            String prefix = "Update Company SET ContactName='" + dis.NamePerson + "', ContactPhone='" + dis.Phone + "', ContactMail='" + dis.Email + "'";
            command = prefix;
            command += " where CompanyNo='" + dis.CompanyNo + "';";
            return command;
        }
        //מחיקת מפיץ
        public int deleteDistributor(string companyNo)
        {
            SqlConnection con;
            SqlCommand cmd;
            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            String cStr = "DELETE FROM Company WHERE CompanyNo='" + companyNo + "';";     // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command '" + per.Gmail + "';"
            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected;
            }
            catch (Exception ex)
            {
                return 0;
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }


        //מחיקת סטודנט
        public int deleteStudent(string StudentId)
        {
            SqlConnection con;
            SqlCommand cmd;
            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            String cStr = "DELETE FROM Student WHERE StudentId ='" + StudentId + "';";     // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command '" + per.Gmail + "';"
            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
                return numEffected;
            }
            catch (Exception ex)
            {
                return 0;
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        //התחברות עם פייסבוק
        public Student FacebookLogin(String email, String firstName, String lastName, String password)
        {
            // Need to check if exists. Otherwise add to DB
            var currentStudentList = GetListStudent(connectionString).FirstOrDefault(i => i.Email == email);
            if (currentStudentList != null)
                return currentStudentList;
            password = "";
            return Register(email, firstName, lastName, "", password, "");
        }

        //עדכון פרטי סטודנט בהינתן אימייל
        public int UpdateStudentDataByEmail(String email, Student s)
        {
            SqlConnection con = null;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String updateSTR = "UPDATE STUDENT SET ";
                updateSTR += " FirstName='" + s.FirstName + "', ";
                updateSTR += " LastName='" + s.LastName + "', ";
                updateSTR += " CellPhone='" + s.CellPhone + "', ";
                updateSTR += " gender='" + s.Gender + "' ";
                updateSTR += " Where Email='" + email + "'";
                SqlCommand cmd = new SqlCommand(updateSTR, con);

                var t = cmd.ExecuteNonQuery();
                return t;
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
        //עדכון סיסמא
        public int UpdatePassword(String email, String newPassword)
        {
            SqlConnection con = null;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String updateSTR = "UPDATE STUDENT SET ";
                updateSTR += " Password='" + newPassword + "' ";
                updateSTR += " Email='" + email + "'";
                SqlCommand cmd = new SqlCommand(updateSTR, con);

                return cmd.ExecuteNonQuery();
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

        //פונקציה שמביאה את כל המחלקות
        public List<Department> AllDepartments()
        {
            SqlConnection con = null;
            List<Department> departmentsList = new List<Department>();
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Department";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Department s = new Department
                    {
                        DepartmentCode = Convert.ToInt32(dr["DepartmentCode"]),
                        DepartmentName = Convert.ToString(dr["DepartmentName"]),
                        Description = Convert.ToString(dr["Description"]),
                        SubDepartmentList = AllSubDepartments(Convert.ToInt32(dr["DepartmentCode"])),
                    };
                    departmentsList.Add(s);
                }

                return departmentsList;
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


        //פונקציה שמביאה את כל התתי המחלקות
        public List<SubDepartment> AllSubDepartments(int DepartmentCode)
        {
            SqlConnection con = null;
            List<SubDepartment> subDepartmentsList = new List<SubDepartment>();
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Department_SubDepartment where DepartmentCode = '"+DepartmentCode +"'";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    SubDepartment s = new SubDepartment
                    {
                        SubDepartmentId = Convert.ToInt32(dr["SubDepartmentId"]),
                        SubDepartmentName = Convert.ToString(dr["SubDepartmentName"]),
                        DepartmentCode = Convert.ToInt32(dr["DepartmentCode"]),

                    };
                    subDepartmentsList.Add(s);
                }

                return subDepartmentsList;
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

        //עדכון מחלקה ותת מחלקה לסטודנט
        public int UpdateStudentDeapartmentAndSubDepartment(String email, int departmentCode, int subDepartmentCode)
        {
            SqlConnection con = null;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String updateSTR = "UPDATE STUDENT SET ";
                updateSTR += " DepartmentDepartmentCode='" + departmentCode + "', ";
                updateSTR += " SubDepartmentCode='" + subDepartmentCode + "' ";
                updateSTR += " Where Email='" + email + "'";
                SqlCommand cmd = new SqlCommand(updateSTR, con);

                var t = cmd.ExecuteNonQuery();
                return t;
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

        public List<Language> GetStudentLanguages(int studentId)
        {
            SqlConnection con = null;
            List<Language> languagesList = new List<Language>();
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Language_Student where StudentStudentId = " + studentId;
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Language s = new Language
                    {
                        Name = Convert.ToString(dr["LanguageLangName"]),
                        Degree = Convert.ToInt32(dr["Degree"]),

                    };
                    languagesList.Add(s);
                }

                return languagesList;
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
        public void UpdateStudentLanguages(int studentId, List<Language> languages)
        {
            RemoveStudentLanguages(studentId);
            AddStudentLanguages(studentId, languages);
        }
        private void RemoveStudentLanguages(int studentId)
        {
            SqlConnection con;
            SqlCommand cmd;
            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            String cStr = "DELETE FROM Language_Student WHERE StudentStudentId = " + studentId + ";";     // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command '" + per.Gmail + "';"
            try
            {
                int numEffected = cmd.ExecuteNonQuery(); // execute the command
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
                    // close the db connection
                    con.Close();
                }
            }
        }
        private void AddStudentLanguages(int studentId, List<Language> languages)
        {
            SqlConnection con = null;
            if (languages == null || languages.Count == 0)
                return;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String addStr = "Insert Into Language_Student Values ";
                bool isFirst = true;
                foreach (var lang in languages)
                {
                    if (String.IsNullOrEmpty(lang.Name))
                        continue;
                    if (isFirst)
                    {
                        addStr += String.Format("('{0}', {1}, {2})", lang.Name, studentId, lang.Degree);
                        isFirst = false;
                    }
                    else
                        addStr += String.Format(",('{0}', {1}, {2});", lang.Name, studentId, lang.Degree);
                }
                if (isFirst)
                    return;

                var cmd = CreateCommand(addStr, con);
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
    }
}
