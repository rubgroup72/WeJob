using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Proj_WeJob.Models.DAL;

namespace Proj_WeJob.Models
{
    public class Interst
    {
        //properties      
        public string Name { get; set; }

        //constructor
        public Interst(string Name)
        {
            this.Name = Name;
        }

        public Interst()
        {
        }

        // פונקציה שמחזירה רשימה של תחביבים 
        public List<Interst> ReadInterst()
        {
            DBservices dbs = new DBservices();
            return dbs.GetListInterst("DBConnectionString");
        }
    }
}