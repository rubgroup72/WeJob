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
    [Route("api/AppSubCategoryController")]
    public class AppSubCategoryController : ApiController
    {
        //פונקציה שמביאה את כל התגיות מהדטא בייס לפי קוד קטגוריה
        [HttpGet]
        public SubCatergoryResponse Get(int categoryCode, int studentId)
        {
            Tags t = new Tags();
            SubCatergoryResponse ret = new SubCatergoryResponse();
            ret.AllTagsList = t.GetAllTags(categoryCode);
            Student s = new Student();
            s.StudentId = studentId;
            ret.StudentTagsList = s.GetSelectedSubCategories();
            return ret;
        }

        //עדכון תגיות שהסטודנט בחר
        [HttpPost]
        public void Post([FromBody] Student s)
        {
            if (s == null)
                return;
            s.UpdateStudentSubCategories();
        }

        //מחלקה שמחזיקה את כל התגיות שיש בדטא בייס ואת כל התגיות שהמשתמש בחר
        public class SubCatergoryResponse
        {
            public List<Tags> AllTagsList { get; set; }
            public List<int> StudentTagsList { get; set; }
        }
    }

}

