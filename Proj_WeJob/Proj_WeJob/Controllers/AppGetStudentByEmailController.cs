﻿using Proj_WeJob.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Proj_WeJob.Controllers
{
    public class AppGetStudentByEmailController : ApiController
    {
        //פונקציה שמחזירה את הסטודנט הרלוונטי לפי אימייל - משמש את האפליקציה
        [HttpGet]
        [Route("api/AppGetStudentByEmail")]
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        public Student Get([FromUri] string email)
        {
            Student s = new Student();
            return s.GetListStudent().FirstOrDefault(i => i.Email == email);
        }

    }
}
