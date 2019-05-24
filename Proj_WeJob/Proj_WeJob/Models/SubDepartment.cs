using Proj_WeJob.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Proj_WeJob.Models
{
    public class SubDepartment
    {
        //properties
        public int SubDepartmentId { get; set; }
        public string SubDepartmentName { get; set; }
        public int DepartmentCode { get; set; }

        //constructor
        public SubDepartment(int SubDepartmentId, string SubDepartmentName, int DepartmentCode)
        {
            this.SubDepartmentId = SubDepartmentId;
            this.SubDepartmentName = SubDepartmentName;
            this.DepartmentCode = DepartmentCode;
        }
        public SubDepartment()
        {
        }

        // פונקציה שמחזירה רשימה של מחלקות 
        public List<SubDepartment> GetListSubDepartment(string DepartmentCode)
        {
            DBservices dbs = new DBservices();
            return dbs.GetListSubDepartment("DBConnectionString",DepartmentCode);
        }
    }
}