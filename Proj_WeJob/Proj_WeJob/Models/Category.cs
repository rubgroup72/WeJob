using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Proj_WeJob.Models.DAL;

namespace Proj_WeJob.Models
{
    public class Category
    {
        public int CategoryNo { get; set; }
        public string CategoryName { get; set; }

        public Category(int CategoryNo,string CategoryName)
        {
            this.CategoryName = CategoryName;
            this.CategoryNo = CategoryNo;
        }
        public Category()
        {
        }
        public List<Category> GetListCategory()
        {
            DBservices dbs = new DBservices();
            return dbs.GetListCategory("DBConnectionString");
        }
    }
}