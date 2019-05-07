using System.Collections.Generic;
using Proj_WeJob.Models.DAL;

namespace Proj_WeJob.Models
{
    public class SubCategory
    {
        public int SubCategoryNo { get; set; }
        public string SubCategoryName { get; set; }

        public SubCategory()
        {

        }
        public SubCategory(int SubCategoryNo, string SubCategoryName)
        {
            this.SubCategoryNo = SubCategoryNo;
            this.SubCategoryName = SubCategoryName;
        }
        // פונקציה שמחזירה רשימה של תתי קטגוריות 
        public List<SubCategory> ReadSubCategories(string CategoryNo)
        {
            DBservices dbs = new DBservices();
            return dbs.GetListSubCategories("DBConnectionString", CategoryNo);
        }
        // פונקציה שמחזירה רשימה של תתי קטגוריות לפי החיפוש
        public List<SubCategory> ReadSubCategoriesForSearch(string search, string CategoryNo)
        {
            DBservices dbs = new DBservices();
            return dbs.GetListSubCategoriesForSearch("DBConnectionString", search, CategoryNo);
        }
    }
}