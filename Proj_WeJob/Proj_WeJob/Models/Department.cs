using Proj_WeJob.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Proj_WeJob.Models
{
    public class Department
    {
        //properties
        public int DepartmentCode { get; set; }
        public string DepartmentName { get; set; }
        public string Description { get; set; }
        public List<SubDepartment> SubDepartmentList { get; set; }


        //constructor
        public Department()
        {
        }

        // פונקציה שמחזירה רשימה של תחביבים 
        public List<SubDepartment> GetSubDepartmentList(int departmentCode)
        {
            DBservices dbs = new DBservices();
            return dbs.AllSubDepartments(departmentCode);
        }

    }
        
}