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
        private static object locker = new object();

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
        //פונקציה שמקבלת שורה וממירה שדה מספרי למספר
        private int GetIntFromSqlDataReader(SqlDataReader dr, string propName)
        {
            try
            {
                return Convert.ToInt32(dr[propName]);
            }
            catch
            {
                return 0;
            }
        }
        //פונקציה שמייצרת אובייקט של סטודנט
        private Student CreateStudentFromSqlDataReader(SqlDataReader dr, bool includeCV = false)
        {
            var s = new Student
                        (
                        Convert.ToInt32(dr["StudentID"]),
                        Convert.ToString(dr["FirstName"]),
                        Convert.ToString(dr["LastName"]),
                        Convert.ToString(dr["CellPhone"]),
                        Convert.ToString(dr["Email"]),
                        Convert.ToString(dr["Gender"]),
                        Convert.ToString(dr["DepartmentName"]),
                        Convert.ToString(dr["SubDepartmentName"]),
                        GetIntFromSqlDataReader(dr, "DepartmentDepartmentCode"),
                        GetIntFromSqlDataReader(dr, "SubDepartmentCode"),
                        Convert.ToString(dr["CV_Name"])
                        );
            if (includeCV)
                s.CVFile = Convert.ToString(dr["CV_File"]);
            return s;
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
            sb.AppendFormat("Values('{0}','{1}','{2}',{3},'{4}','{5}','{6}','{7}','{8}',{9},{10},{11},'{12}')", job.JobName, job.JobDescription, job.Requirements, Convert.ToInt32(job.CompanyCompanyNo), job.Location,job.MailForCV ,job.OpenDate, job.ToDate,job.Link,job.CategoryNo,0,0, job.Status);
            String prefix = "INSERT INTO Job " + "(JobName,JobDescription,Requirements,CompanyCompanyNo,Location,MailForCV,OpenDate,ToDate,Link,CategoryNo,AmountSend,IsDeleted,JobStatusStatusName) ";
            command = prefix + sb.ToString();
            command += "; SELECT SCOPE_IDENTITY()";
            return command;
        }
        ///+++++++++הוספת תחומי עניין למשרה++++++++++
        //public int Insert_JobInterst( Job job, int id)
        //{
        //    SqlConnection con;
        //    SqlCommand cmd;
        //    try
        //    {
        //        con = connect("DBConnectionString"); // create the connection
        //    }
        //    catch (Exception ex)
        //    {
        //        // write to log
        //        throw (ex);
        //    }
        //    String cStr = BuildInsert_JobInterst(job, id);      // helper method to build the insert string
        //    cmd = CreateCommand(cStr, con);             // create the command
        //    try
        //    {
        //        int numEffected = cmd.ExecuteNonQuery(); // execute the command
        //        return numEffected;
        //    }
        //    catch (Exception ex)
        //    {
        //        return 0;
        //        // write to log
        //        throw (ex);
        //    }
        //    finally
        //    {
        //        if (con != null)
        //        {
        //            // close the db connection
        //            con.Close();
        //        }
        //    }
        //}
        //private String BuildInsert_JobInterst(Job job, int id)
        //{
        //    String command = "";
        //    String prefix;
        //    // use a string builder to create the dynamic string
        //    for (int i = 0; i < job.ArrayIntrests.Count; i++)
        //    {
        //        StringBuilder sb = new StringBuilder();
        //        sb.AppendFormat("Values({0},'{1}')", id.ToString(), job.ArrayIntrests[i]);
        //        prefix = "INSERT INTO bgroup72_prod.dbo.Job_Intrests (JobJobNo,IntrestsIntrestName)";
        //        command = command + prefix + sb.ToString() + ";";
        //    }
        //    return command;
        //}
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
        //הוספת תתי קטגוריות למשרה
        public int Insert_JobSubCategory(Job job, int id)
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
            String cStr = BuildInsert_JobSubCategory(job, id);      // helper method to build the insert string
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
        private String BuildInsert_JobSubCategory(Job job, int id)
        {
            String command = "";
            String prefix;
            // use a string builder to create the dynamic string
            for (int i = 0; i < job.ArrayLanguage.Count; i++)
            {
                StringBuilder sb = new StringBuilder();
                sb.AppendFormat("Values({0},{1})", id.ToString(), job.ArraySubCategory[i]);
                prefix = "INSERT INTO bgroup72_prod.dbo.SubCategory_Job(JobJobNo,SubCategorySubCategoryNo)";
                command = command + prefix + sb.ToString() + ";";
            }
            return command;
        }
        //פונקציה שמעדכנת סטטוס מקרה מחמה לרגילה
        public int updateStatusJob(Job j)
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
            String cStr = "UPDATE Job SET JobStatusStatusName = '"+j.JobStatusStatusName+"' WHERE JobNo = '"+j.JobNo+"' ";
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
        //פונקציה שמעדכנת שדה בוליאני לנמחק 
        public int updateIsDeleted(Job j)
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
            String cStr = "UPDATE Job SET IsDeleted = '1' WHERE JobNo = '" + j.JobNo + "' ";
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
        //פונקציה שמחזירה רשימת סדנאות
        public List<WorkShop> GetListWorkShop(string conString)
        {
            SqlConnection con = null;
            List<WorkShop> ld = new List<WorkShop>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT * FROM WorkShop";
                SqlCommand cmd = new SqlCommand(selectSTR, con);
                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {   // Read till the end of the data into a row
                    WorkShop d = new WorkShop
                    {
                        WorkShopCode = Convert.ToInt32(dr["WorkShopCode"]),
                        WorkShopName = Convert.ToString(dr["WorkShopName"]),
                        Date = Convert.ToDateTime(dr["Date"]),
                        MaxParticipants = Convert.ToInt32(dr["MaxParticipants"]),
                        MinParticipants = Convert.ToInt32(dr["MinParticipants"]),
                        NoOfRegisters = Convert.ToInt32(dr["NoOfRegisters"]),
                    };
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
        // פונקציה שמחזירה רשימה של שמות משרות עם כמות המועמדים ששלחו למשרה קורות חיים עם שם החברה
        public List<Job> GetreportJobs(string conString)
        {
            SqlConnection con = null;
            List<Job> ld = new List<Job>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT * FROM Job left join Company on Job.CompanyCompanyNo=Company.CompanyNo";
                SqlCommand cmd = new SqlCommand(selectSTR, con);
                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {   // Read till the end of the data into a row
                    Job d = new Job
                    {
                        JobNo= Convert.ToInt32(dr["JobNo"]),
                        JobName = Convert.ToString(dr["JobName"]),
                        AmountSend = Convert.ToInt32(dr["AmountSend"]),
                        CompanyName = Convert.ToString(dr["CompanyName"]),
                    };
                    if (Convert.ToString(d.AmountSend) == "NULL")
                    {
                        d.AmountSend = 0;
                    }
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
        //פונקציה שמחזירה רשימת סטודנטים קיימים לפי מחלקה ותת מחלקה
        public List<Student> GetListStudentFilter(string conString, string codeDepartment, string SubDepartmentId)
        {
            SqlConnection con = null;
            List<Student> ld = new List<Student>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT * FROM Student where DepartmentDepartmentCode="+ codeDepartment+ "and SubDepartmentCode="+ SubDepartmentId;
                SqlCommand cmd = new SqlCommand(selectSTR, con);
                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {   // Read till the end of the data into a row
                    Student d = new Student
                    {
                       StudentId= Convert.ToInt32(dr["StudentId"]),
                        FirstName=Convert.ToString(dr["FirstName"]),
                        LastName= Convert.ToString(dr["LastName"]),
                        Email=Convert.ToString(dr["Email"]),
                        CellPhone=Convert.ToString(dr["CellPhone"]),
                        Gender = Convert.ToString(dr["gender"]),
                    };
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
        public List<Distributor> GetListDistributor()
        {
            return GetListDistributor(connectionString);
        }
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
                    ld.Add(CreateStudentFromSqlDataReader(dr));
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
        public List<Student> GetListStudent(string conString, bool isActive)
        {
            SqlConnection con = null;
            List<Student> ld = new List<Student>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT * FROM Student S Left Join Department D on S.DepartmentDepartmentCode = D.DepartmentCode Left Join Department_SubDepartment SD on S.SubDepartmentCode = SD.SubDepartmentId Where IsActive = " + (isActive ? "1" : "0");
                SqlCommand cmd = new SqlCommand(selectSTR, con);
                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {   // Read till the end of the data into a row
                    ld.Add(CreateStudentFromSqlDataReader(dr));
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
                    return CreateStudentFromSqlDataReader(dr);
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
            var studentId = 1;
            if (currentStudentList.Count() > 0)
                studentId = currentStudentList.Max(i => i.StudentId) + 1;

            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "Insert Into Student (StudentId, FirstName,LastName,Email,CellPhone,Password,Gender, IsActive) Values";
                selectSTR += String.Format("({0},'{1}','{2}','{3}','{4}','{5}','{6}', 1)", 
                    studentId, firstName, lastName, email, phoneNumber, password, gender);
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
                String selectSTR = "SELECT * FROM Job where Job.CompanyCompanyNo='" + companyNo+ "' and  IsDeleted!=1";
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
        public List<Student> GetListStudent(string conString, string StudentId, bool includeCV = false)
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
                    student.Add(CreateStudentFromSqlDataReader(dr, includeCV));
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
        //פונקציה שמביאה את השפות של הסטודנט
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
        //פונקציית עדכון שפות סטודנט
        public void UpdateStudentLanguages(int studentId, List<Language> languages)
        {
            RemoveStudentLanguages(studentId);
            AddStudentLanguages(studentId, languages);
        }
        //  פונקציות עזר לשפות
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
                        addStr += String.Format(",('{0}', {1}, {2})", lang.Name, studentId, lang.Degree);
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
        //פונקציית עדכון תגיות סטודנט
        public void UpdateStudentSubCategories(int studentId, List<Tags> tags)
        {
            RemoveStudentTags(studentId);
            AddStudentTags(studentId, tags);
        }

        //  פונקציות עזר לתגיות
        private void RemoveStudentTags(int studentId)
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
            String cStr = "DELETE FROM Student_SubCategory WHERE StudentId = " + studentId + ";";     // helper method to build the insert string
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
        private void AddStudentTags(int studentId, List<Tags> tags)
        {
            SqlConnection con = null;
            if (tags == null || tags.Count == 0)
                return;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String addStr = "Insert Into Student_SubCategory Values ";
                bool isFirst = true;
                foreach (var tag in tags)
                {

                    if (isFirst)
                    {
                        addStr += String.Format("({0}, {1})", tag.SubCategoryNo, studentId);
                        isFirst = false;
                    }
                    else
                        addStr += String.Format(",({0}, {1})", tag.SubCategoryNo, studentId);
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

        public List<Tags> GetStudentSelectedTags(string studentId)
        {
            SqlConnection con = null;
            List<Tags> lp = new List<Tags>();
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT * FROM [Student_SubCategory] Where StudentId = " + studentId;
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Tags la = new Tags
                    {
                        SubCategoryNo = Convert.ToInt32(dr["SubCategoryNo"]),
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
        public List<int> GetStudentDirectJobs(string studentId)
        {
            SqlConnection con = null;
            var lp = new List<int>();
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT * FROM [Job_Student] where StudentStudentId = " + studentId;
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    lp.Add(Convert.ToInt32(dr["JobJobNo"]));
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
        public List<Tags> GetTagsByJobId(int jobId)
        {
            SqlConnection con = null;
            List<Tags> lp = new List<Tags>();
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT * FROM [SubCategory_Job] Where [JobJobNo] = " + jobId;
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Tags la = new Tags
                    {
                        SubCategoryNo = Convert.ToInt32(dr["SubCategorySubCategoryNo"]),
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

        //פונקציה שמחזירה רשימה של תגיות 
        public List<Tags> GetListTags(int CategoryCode)
        {
            SqlConnection con = null;
            List<Tags> lp = new List<Tags>();
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT TOP 100 * FROM Hot_Tags where CategoryNo = '"+ CategoryCode + "'";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Tags la = new Tags
                    {
                        SubCategoryNo = Convert.ToInt32(dr["SubCategoryNo"]),
                        TagName = Convert.ToString(dr["TagName"]),
                        Count = Convert.ToInt32(dr["Count"])
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

        //פונקציה שמחזירה רשימה של קטגוריות 
        public List<Category> GetListCategories(string conString)
        {
            SqlConnection con = null;
            List<Category> lp = new List<Category>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Category";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Category la = new Category
                    {
                        CategoryNo = Convert.ToInt32(dr["CategoryNo"]),
                        CategoryName = Convert.ToString(dr["CategoryName"])
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
        //פונקציה שמחזירה מחלקות
        public List<Department> GetListDepartment(string conString)
        {
            SqlConnection con = null;
            List<Department> lp = new List<Department>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Department";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Department la = new Department
                    {
                        DepartmentCode = Convert.ToInt32(dr["DepartmentCode"]),
                        DepartmentName = Convert.ToString(dr["DepartmentName"])
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

        // פונקציה שמחזירה רשימה של תתי קטגוריות לפי הקטגוריה שנבחרה
        public List<SubCategory> GetListSubCategories(string conString, string CategoryNo)
        {
            SqlConnection con = null;
            List<SubCategory> lsc = new List<SubCategory>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Hot_Tags where CategoryNo='" + CategoryNo+"'";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    SubCategory sc = new SubCategory
                    {
                        SubCategoryNo = Convert.ToInt32(dr["SubCategoryNo"]),
                        TagName = Convert.ToString(dr["TagName"])
                    };
                    lsc.Add(sc);
                }

                return lsc;
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

        //פונקציה שמחזירה את התתי מחלקות לפי קוד מחלקה
        public List<SubDepartment> GetListSubDepartment(string conString, string DepartmentCode)
        {
            SqlConnection con = null;
            List<SubDepartment> lsc = new List<SubDepartment>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Department_SubDepartment where DepartmentCode='" + DepartmentCode + "'";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    SubDepartment sc = new SubDepartment
                    {
                        SubDepartmentId = Convert.ToInt32(dr["SubDepartmentId"]),
                        SubDepartmentName = Convert.ToString(dr["SubDepartmentName"])
                    };
                    lsc.Add(sc);
                }

                return lsc;
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


        // פונקציה שמחזירה רשימה של תתי קטגוריות עבור החיפוש ולפי אותה הקטגוריה שנבחרה 
        public List<SubCategory> GetListSubCategoriesForSearch(string conString,string search, string CategoryNo)
        {
            SqlConnection con = null;
            List<SubCategory> lsc = new List<SubCategory>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Category_SubCategory as csc left join SubCategory as sc on csc.SubCategorySubCategoryNo= sc.SubCategoryNo where CategoryCategoryNo='" + CategoryNo + "' and sc.SubCategoryName like '%"+search+"%'";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    SubCategory sc = new SubCategory
                    {
                        SubCategoryNo = Convert.ToInt32(dr["SubCategoryNo"]),
                        TagName = Convert.ToString(dr["SubCategoryName"])
                    };
                    lsc.Add(sc);
                }

                return lsc;
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
       
        ///פונקציה שמחזירה רשימה של משרות חמות לפי מספר קטגוריה
        public List<Job> GetHotJobsByCategoryNo(string CategoryNo)
        {
            SqlConnection con = null;
            List<Job> lsc = new List<Job>();
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Job where CategoryNo='" + CategoryNo + "' and JobStatusStatusName='חמה'";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Job sc = new Job
                    {
                        JobNo = Convert.ToInt32(dr["JobNo"]),
                        JobName = Convert.ToString(dr["JobName"]),
                        OpenDate = Convert.ToDateTime(dr["OpenDate"]),
                        ToDate = Convert.ToDateTime(dr["ToDate"]),
                        Location = Convert.ToString(dr["Location"]),
                        Status = Convert.ToString(dr["JobStatusStatusName"]),
                        CompanyCompanyNo = Convert.ToInt32(dr["CompanyCompanyNo"]),
                    };
                    lsc.Add(sc);
                }

                return lsc;
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
        //פונקציה שמחזירה את כל המשרות שנמחקו
        public List<Job> getHistory()
        {
            SqlConnection con = null;
            List<Job> lsc = new List<Job>();
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Job where IsDeleted='1'";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Job sc = new Job
                    {
                        JobNo = Convert.ToInt32(dr["JobNo"]),
                        JobName = Convert.ToString(dr["JobName"]),
                        OpenDate = Convert.ToDateTime(dr["OpenDate"]),
                        ToDate = Convert.ToDateTime(dr["ToDate"]),
                        Location = Convert.ToString(dr["Location"]),
                        Status = Convert.ToString(dr["JobStatusStatusName"]),
                        CompanyCompanyNo = Convert.ToInt32(dr["CompanyCompanyNo"]),
                    };
                    lsc.Add(sc);
                }

                return lsc;
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
        //פונקציה שמחזירה שמות של משרות עבור קטגוריה נתונה
        public List<Job> GetListJobNames (int CategoryNo )
        {
            SqlConnection con = null;
            List<Job> lsc = new List<Job>();
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Job where CategoryNo='" + CategoryNo + "'";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Job sc = new Job
                    {
                        JobNo = Convert.ToInt32(dr["JobNo"]),
                        JobName = Convert.ToString(dr["JobName"]),
                    };
                    lsc.Add(sc);
                }

                return lsc;
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
		
		public int GetAmountDistributors(string conString)
        {
            SqlConnection con = null;
           int AmountDistributors = 0;
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM [bgroup72_prod].[dbo].[Company]";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row

                    AmountDistributors += 1;

                }

                return AmountDistributors;
           
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
        public int GetAmountStudents(string conString)
        {
            SqlConnection con = null;
            int AmountStudents = 0;
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM [bgroup72_prod].[dbo].[Student]";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row

                    AmountStudents += 1;

                }

                return AmountStudents;

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
        public int GetAmountJobsGood(string conString)
        {
            SqlConnection con = null;
            int AmountJobsGood = 0;
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM [bgroup72_prod].[dbo].[Job] where AmountSend>0";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    AmountJobsGood += 1;
                }
                return AmountJobsGood;
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
        public int GetAmountJobsBad(string conString)
        {
            SqlConnection con = null;
            int AmountJobsBad = 0;
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM [bgroup72_prod].[dbo].[Job] where AmountSend is null";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    AmountJobsBad += 1;
                }
                return AmountJobsBad;
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
        public List<Job> GetPopularJobs(string conString)
        {
            SqlConnection con = null;
            List<Job> lsc = new List<Job>();
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT *"+
                                        "FROM bgroup72_prod.dbo.Job as j1 left join bgroup72_prod.dbo.Category as c on j1.CategoryNo=c.CategoryNo" +
                                        " WHERE(AmountSend) in "+
                                        "(SELECT MAX(AmountSend) FROM bgroup72_prod.dbo.Job as j2 " +
                                        "GROUP BY CategoryNo)";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Job sc = new Job
                    {
                        JobNo = Convert.ToInt32(dr["JobNo"]),
                        JobName = Convert.ToString(dr["JobName"]),
                        Requirements= Convert.ToString(dr["Requirements"]),
                        JobDescription = Convert.ToString(dr["JobDescription"]),
                        AmountSend =Convert.ToInt32(dr["AmountSend"]),
                        CategoryName =Convert.ToString(dr["CategoryName"]),
                    };
                    lsc.Add(sc);
                }
                return lsc;
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
        //פונקציה שמחזירה את המשרות של סטודנט ספציפי ,חדשות,שלח קורות חיים,אהב לפי סטטוס
        public List<Job> GetJobSaveAndSend(string conString, string ID)
        {
            SqlConnection con = null;
            List<Job> lsc = new List<Job>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT *" +
                                        "FROM bgroup72_prod.dbo.Job as j1 left join bgroup72_prod.dbo.Student_Returned_Jobs as srj on j1.JobNo=srj.JobID left join bgroup72_prod.dbo.Category c on c.CategoryNo=j1.CategoryNo" +
                                        " WHERE srj.StudentID="+ID+" and IsDeleted!=1";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Job sc = new Job
                    {
                        JobNo = Convert.ToInt32(dr["JobNo"]),
                        JobName = Convert.ToString(dr["JobName"]),
                        AmountSend = Convert.ToInt32(dr["AmountSend"]),
                        CategoryName = Convert.ToString(dr["CategoryName"]),
                        Status = Convert.ToString(dr["JobStatusStatusName"]),
                        StudentJobStatus = Convert.ToString(dr["JobStatus"]),
                    };
                    lsc.Add(sc);
                }
                return lsc;
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
        public List<Student> GetTagsforStudent(string conString, string ID)
        {
            SqlConnection con = null;
            List<Student> lsc = new List<Student>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM bgroup72_prod.dbo.Student_SubCategory as ss left join bgroup72_prod.dbo.SubCategory as sc on ss.SubCategoryNo=sc.SubCategoryNo where ss.StudentId=" + ID;
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Student sc = new Student
                    {
                        SubCategoryName = Convert.ToString(dr["SubCategoryName"]),
                    };
                    lsc.Add(sc);
                }
                return lsc;
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
        //פונקציית עדכון תגיות סטודנט
        public void UpdateStudentTempJobs(int studentId, List<Job> jobTitles)
        {
            RemoveStudentTempJobs(studentId);
            AddStudentTempJobs(studentId, jobTitles);
        }

        //  פונקציות עזר לתגיות
        private void RemoveStudentTempJobs(int studentId)
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
            String cStr = "DELETE FROM Job_Student WHERE StudentStudentId = " + studentId + ";";     // helper method to build the insert string
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
        private void AddStudentTempJobs(int studentId, List<Job> jobs)
        {
            SqlConnection con = null;
            if (jobs == null || jobs.Count == 0)
                return;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String addStr = "Insert Into Job_Student Values ";
                bool isFirst = true;
                foreach (var job in jobs)
                {

                    if (isFirst)
                    {
                        addStr += String.Format("({0}, {1}, {2}, '{3}')", job.JobNo, studentId, "GETDATE()", "");
                        isFirst = false;
                    }
                    else
                        addStr += String.Format(",({0}, {1}, {2}, '{3}')", job.JobNo, studentId, "GETDATE()", "");
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
        //פונקציית עדכון קורות חיים בדטא בייס
        public int UpdateCV(int StudentId, string CVFile, string CVName)
        {
            SqlConnection con = null;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String updateSTR = "UPDATE STUDENT SET ";
                updateSTR += " CV_Name='" + CVName + "', ";
                updateSTR += " CV_File='" + CVFile + "' ";
                updateSTR += " Where StudentId= " + StudentId + ";";
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
        //הבאת משרות רלוונטיות לפי תגיות נבחרות ושמות של משרות
        public List<Job> GetListOfJobs(string studentId)
        {
            SqlConnection con = null;
            //int intStudentId = Convert.ToInt32(studentId);
            List<Job> lsc = new List<Job>();
            if (String.IsNullOrEmpty(studentId))
                return lsc;

            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR =
                "select * from [bgroup72_prod].[dbo].[Job] " +
                "left join Company C on Job.CompanyCompanyNo = C.CompanyNo " +
                "where [bgroup72_prod].[dbo].[Job].[IsDeleted]!=1 and job.JobNo in " +
                "(select SJ.JobJobNo from[bgroup72_prod].[dbo].[SubCategory_Job] SJ " +
                "where SubCategorySubCategoryNo in " +
                "(select SubCategoryNo from[bgroup72_prod].[dbo].[SubCategory] " +
                "where SubCategory.SubCategoryName in " +
                "(select distinct SubCategoryName2 from[bgroup72_prod].[dbo].[Table_PrecentPairTags] " +
                "where [Table_PrecentPairTags].SubCategoryName1 in " +
                "(select distinct SubCategoryName from[bgroup72_prod].[dbo].[SubCategory] as s " +
                "left join[bgroup72_prod].[dbo].[Student_SubCategory] as ssc on s.SubCategoryNo= ssc.SubCategoryNo where StudentId = "+ studentId+")" +
                "and precent>=0.01 and SubCategoryName1<>SubCategoryName2)) " +
                "UNION " +
                "select SJ.JobJobNo from SubCategory_Job SJ " +
                "where SubCategorySubCategoryNo in " +
                "(select SubCategoryNo from Student_SubCategory where StudentId= " + studentId +") " +
                "UNION " +
                "select JobJobNo from[bgroup72_prod].[dbo].[Job_Student] where StudentStudentId = " + studentId +"); ";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {   // Read till the end of the data into a row
                    Job sc = new Job
                    {
                        JobNo = Convert.ToInt32(dr["JobNo"]),
                        JobName = Convert.ToString(dr["JobName"]),
                        JobDescription = Convert.ToString(dr["JobDescription"]),
                        Requirements = Convert.ToString(dr["Requirements"]),
                        CompanyCompanyNo = Convert.ToInt32(dr["CompanyCompanyNo"]),
                        MailForCV = Convert.ToString(dr["MailForCV"]),
                        Location = Convert.ToString(dr["Location"]),
                        JobStatusStatusName = Convert.ToString(dr["JobStatusStatusName"]),
                        Link = Convert.ToString(dr["JobStatusStatusName"]),
                        CategoryNo = Convert.ToInt32(dr["CategoryNo"]),
                        CompanyName = Convert.ToString(dr["CompanyName"]),
                        ContactName = Convert.ToString(dr["ContactName"]),
                        ContactPhone = Convert.ToInt32(dr["ContactPhone"]),
                        ContactMail = Convert.ToString(dr["ContactMail"]),
                        OpenDate = Convert.ToDateTime(dr["OpenDate"]),
                        ToDate = Convert.ToDateTime(dr["ToDate"])
                    };
                    lsc.Add(sc);
                }

                return lsc;
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
        //פוקנציה שמחזירה את התגיות שנבחרו ע"י סטודנט כדי לסמן אותן באפליקציה
        public List<int> GetSelectedSubCategories(int studentId)
        {
            SqlConnection con = null;
            List<int> retList = new List<int>();
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM Student_SubCategory where StudentId=" + studentId + ";";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {
                    retList.Add(Convert.ToInt32(dr["SubCategoryNo"]));
                }

                return retList;
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
        //פונקציה שמחזירה את הקטגוריה שנבחרה ע"י הסטודנט כדי לסמן באפליקציה
        public int GetStudentSelectedCategory(int subCategory)
        {
            SqlConnection con = null;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "select CategoryCategoryNo from Category_SubCategory where SubCategorySubCategoryNo = " + subCategory;
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end

                while (dr.Read())
                {
                    return Convert.ToInt32(dr["CategoryCategoryNo"]);
                }

                return 0;
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
        public void AddNewStudentJobStatus(string studentId, List<int> jobNoList)
        {
            SqlConnection con = null;
            if (jobNoList.Count == 0)
                return;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "INSERT INTO [Student_Returned_Jobs] VALUES ";
                for (var i = 0; i < jobNoList.Count; ++i)
                {
                    selectSTR += "(" + studentId + "," + jobNoList[i] + ",'" + Job.JOB_STATUS_NEW + "')" + ((i == jobNoList.Count - 1) ? "" : ",");
                }
                selectSTR += ";";

                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
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
        public void IncreaseJobCvSendAmount(string jobId)
        {
            SqlConnection con = null;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "UPDATE[Job] SET[AmountSend] = [AmountSend] + 1 WHERE JobNo = " + jobId;
                SqlCommand cmd = new SqlCommand(selectSTR, con);
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
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
        public void UpdateStudentJobStatus(string studentId, string jobId, string status)
        {
            SqlConnection con = null;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "Update [Student_Returned_Jobs] Set JobStatus = '" + status + "' Where StudentID = " + studentId + " and JobID = " + jobId;
                SqlCommand cmd = new SqlCommand(selectSTR, con);
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
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
        public Dictionary<int, string> GetStudentJobStatus(string studentId, List<int> jobNoList)
        {
            SqlConnection con = null;
            if (jobNoList.Count == 0)
                return new Dictionary<int, string>();
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT * FROM [Student_Returned_Jobs] Where StudentId = " + studentId + " and jobId in (";
                for (var i = 0; i < jobNoList.Count; ++i)
                {
                    selectSTR += jobNoList[i] + ((i == jobNoList.Count - 1) ? "" : ",");
                }
                selectSTR += ");";

                SqlCommand cmd = new SqlCommand(selectSTR, con);

                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                var dict = new Dictionary<int, string>();
                while (dr.Read())
                {   // Read till the end of the data into a row
                    dict.Add(Convert.ToInt32(dr["JobID"]), Convert.ToString(dr["JobStatus"]));
                }

                return dict;
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
        public void RegisterStudentDevice(string studentId, bool register, string fcmToken)
        {
            lock (locker)
            {
                var currentToken = GetStudentDeviceId(new List<string>() { studentId }).FirstOrDefault();
                if (currentToken == fcmToken && register)
                    return;
                DeActivateOldDevice(studentId, fcmToken);
                if (register)
                    AddStduentDeviceId(studentId, fcmToken);
            }
            
        }
        public List<string> GetStudentDeviceId(List<string> studentIdList)
        {
            SqlConnection con = null;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file

                String selectSTR = "SELECT * FROM [StudentAppDevice] Where IsActive = 1 and StudentId in (";
                foreach (var s in studentIdList)
                    selectSTR += s + ",";
                selectSTR = selectSTR.Remove(selectSTR.Length - 1);
                selectSTR += ");";

                List<string> retList = new List<string>();
                SqlCommand cmd = new SqlCommand(selectSTR, con);
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {
                    retList.Add(Convert.ToString(dr["Token"]));
                }

                return retList;
            }
            catch (Exception ex)
            {
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
        private void DeActivateOldDevice(string studentId, string fcmToken)
        {
            SqlConnection con = null;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "Update [StudentAppDevice] set IsActive = 0 where StudentId = " + studentId;
                if (!string.IsNullOrEmpty(fcmToken))
                    selectSTR += " Or Token = '" + fcmToken + "'";
                SqlCommand cmd = new SqlCommand(selectSTR, con);
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
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
        private void AddStduentDeviceId(string studentId, string fcmToken)
        {
            SqlConnection con = null;
            try
            {
                con = connect(connectionString);
                String selectSTR = "INSERT INTO [StudentAppDevice] VALUES (" + studentId + ",'" + fcmToken + "', 1)";
                SqlCommand cmd = new SqlCommand(selectSTR, con);

                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
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
