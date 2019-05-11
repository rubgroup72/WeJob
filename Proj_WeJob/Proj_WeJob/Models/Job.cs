using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


namespace Proj_WeJob.Models.DAL
{
    public class Job
    {
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
        public List<String> ArrayIntrests { get; set; }
        public List<String> ArrayLanguage{ get; set; }
        public List<String> ArraySkill { get; set; }
        public List<string> ArraySubCategory { get; set; }
        public List<string> JobTitlesList { get; set; }

        //constructor
        public Job(int JobNo,string JobName, string JobDescription, string Requirements,
            int CompanyCompanyNo, string MailForCV, DateTime OpenDate, DateTime ToDate,
            string JobStatusStatusName, string Link, List<String> ArrayIntrests, List<String> ArrayLanguage, List<String> ArraySkill, List<string> ArraySubCategory,
            string Location,string Status, int CategoryNo, List <string> JobTitlesList)
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
            this.ArrayIntrests = ArrayIntrests;
            this.ArrayLanguage = ArrayLanguage;
            this.ArraySkill = ArraySkill;
            this.ArraySubCategory = ArraySubCategory;
            this.JobTitlesList = JobTitlesList;
        }
        public Job()
        {
        }

        //הכנסת נתונים לטבלה באמצעות קשירה לDB
        public int InsertJob()
        {
            DBservices dbs = new DBservices();
            int num1 = dbs.InsertJob(this);
            int num2 = dbs.Insert_JobSkill(this, num1);
            int num3 = dbs.Insert_JobInterst(this, num1);
            int num4 = dbs.Insert_JobLanguage(this, num1);
            int num5 = dbs.Insert_JobSubCategory(this, num1);
            //return (num1 & num2 & num3 & num4 & num5);
            return (num1 & num5);
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
        //לאפליקציה - מביאה משרות לפי מספר קטגוריה
        public List<Job> GetListJobNames(int CategoryNo)
        {
            DBservices dbs = new DBservices();
            return dbs.GetListJobNames(CategoryNo);
        }

        //לאפליקציה - מביאה משרות לפי תגיות נבחרות ושמות של משרות
        public List<Job> GetListOfJobs(string studentId)
        {
            DBservices dbs = new DBservices();
            return dbs.GetListOfJobs(studentId);
        }


    }
}