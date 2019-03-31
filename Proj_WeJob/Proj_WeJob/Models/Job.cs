using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Proj_WeJob.Models.DAL
{
    public class Job
    {
        //Propeties 
        public string JobName { get; set; }
        public string JobDescription { get; set; }
        public string Requirements { get; set; }
        public int CompanyCompanyNo { get; set; }
        public string MailForCV { get; set; }
        public DateTime OpenDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Link { get; set; }
        public string Location { get; set; }
        public string Status { get; set; }
        public List<String> ArrayIntrests { get; set; }
        public List<String> ArrayLanguage{ get; set; }
        public List<String> ArraySkill { get; set; }
   
        //constructor
        public Job(string JobName, string JobDescription, string Requirements,
            int CompanyCompanyNo, string MailForCV, DateTime OpenDate, DateTime ToDate,
            string Link, List<String> ArrayIntrests, List<String> ArrayLanguage, List<String> ArraySkill,
            string Location,string Status)
        {
            this.JobName = JobName;
            this.JobDescription = JobDescription;
            this.Requirements = Requirements;
            this.MailForCV = MailForCV;
            this.OpenDate = OpenDate;
            this.ToDate = ToDate;
            this.Link = Link;
            this.Location = Location;
            this.Status = Status;
            this.ArrayIntrests = ArrayIntrests;
            this.ArrayLanguage = ArrayLanguage;
            this.ArraySkill = ArraySkill;
        }
        //הכנסת נתונים לטבלה באמצעות קשירה לDB  
        public int InsertJob()
        {
            DBservices dbs = new DBservices();
            int num1 = dbs.InsertJob(this);
            int num2 = dbs.Insert_JobSkill(this, num1);
            int num3 = dbs.Insert_JobInterst(this, num1);
            int num4 = dbs.Insert_JobLanguage(this, num1);
            return (num1 & num2 & num3 & num4);
        }
    }
}