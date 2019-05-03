using Proj_WeJob.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Proj_WeJob.Models
{
    public class Category
    {
        //properties      
        public int CategoryNo { get; set; }
        public string CategoryName { get; set; }

        //constructor
        public Category()
        {
        }

        // פונקציה שמחזירה רשימה של קטגוריות 
        public List<Category> ReadCategories()
        {
            DBservices dbs = new DBservices();
            return dbs.GetListCategories("DBConnectionString");
        }
    }
}