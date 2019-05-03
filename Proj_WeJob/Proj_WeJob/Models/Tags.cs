using Proj_WeJob.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Proj_WeJob.Models
{
    public class Tags
    {
        //properties      
        public int Id { get; set; }
        public string TagName { get; set; }
        public int Count { get; set; }

        //constructor
        public Tags()
        {
        }

        // פונקציה שמחזירה רשימה של תגיות 
        public List<Tags> GetAllTags(int categoryCode)
        {
            DBservices dbs = new DBservices();
            return dbs.GetListTags(categoryCode);
        }
    }
}