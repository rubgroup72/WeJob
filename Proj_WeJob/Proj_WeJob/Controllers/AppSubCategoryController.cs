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
        public List<Tags> Get(int categoryCode)
        {
            Tags t = new Tags();
            return t.GetAllTags(categoryCode);
        }

        //עדכון תגיות שהסטודנט בחר
        [HttpPost]
        public void Post([FromBody] Student s)
        {
            if (s == null)
                return;
            s.UpdateStudentSubCategories();
        }
    }

}

