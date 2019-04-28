using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Proj_WeJob.Models.DAL;

namespace Proj_WeJob.Models
{
    public class SubCategory
    {
        public int SubCategoryNo { get; set; }
        public string SubCategoryName { get; set; }
        public SubCategory(int SubCategoryNo, string SubCategoryName)
        {
            this.SubCategoryName = SubCategoryName;
            this.SubCategoryNo = SubCategoryNo;
        }
        public SubCategory()
        {
                
        }
        public List<SubCategory> GetListSubCategory(string categoryNo)
        {
            DBservices dbs = new DBservices();
            return dbs.GetListSubCategory("DBConnectionString", categoryNo);
        }
    }
}