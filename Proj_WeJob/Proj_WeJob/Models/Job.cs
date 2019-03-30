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
        public List<String> ArrayIntrests { get; set; }
        public List<String> ArrayLanguage{ get; set; }
        public List<String> ArraySkill { get; set; }
   
        //constructor
        public Job(string JobName, string JobDescription, string Requirements,
            int CompanyCompanyNo, string MailForCV, DateTime OpenDate, DateTime ToDate,
            string Link, List<String> ArrayIntrests, List<String> ArrayLanguage, List<String> ArraySkill)
        {
            this.JobName = JobName;
            this.JobDescription = JobDescription;
            this.Requirements = Requirements;
            this.MailForCV = MailForCV;
            this.OpenDate = OpenDate;
            this.ToDate = ToDate;
            this.Link = Link;
            this.ArrayIntrests = ArrayIntrests;
            this.ArrayLanguage = ArrayLanguage;
            this.ArraySkill = ArraySkill;
        }
    }
}