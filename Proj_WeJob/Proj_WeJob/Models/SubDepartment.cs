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
        public SubDepartment()
        {
        }
    }
}