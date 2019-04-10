﻿using System.Collections.Generic;
using System.Web.Http;
using Proj_WeJob.Models.DAL;


namespace Proj_WeJob.Controllers
{
    public class StudentController:ApiController
    {
     
        //הפעלת פונקציה שמחזירה את כל הסטודנטים
        [HttpGet]
        [Route("api/Students")]
        public IEnumerable<Student> Get()
        {
            Student s = new Student();
            return s.GetListStudent();
        }
        //פונקציה למחיקת סטודנט
        [HttpDelete]
        [Route("api/stu")]
        public void DELETE(string StudentId)
        {
            Student s = new Student();
            s.deleteStudent(StudentId);
        }
    }
}