using Proj_WeJob.Models;
using Proj_WeJob.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Proj_WeJob.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AppCategoryController : ApiController
    {
        //פונקציה שמביאה את כל הקטגוריות
        [HttpGet]
        [Route("api/Category")]
        public CategoryResponse GET(int studentId)
        {
            Category Ca = new Category();
            CategoryResponse CR = new CategoryResponse();
            CR.AllCategoriesList= Ca.ReadCategories();
            Student s = new Student();
            s.StudentId = studentId;
            CR.SelectedCategoryId = s.GetSelectedCategory();
            return CR;
        }
    }

    public class CategoryResponse
    {
        public List<Category> AllCategoriesList { get; set; }
        public int SelectedCategoryId { get; set; }
    }
}
