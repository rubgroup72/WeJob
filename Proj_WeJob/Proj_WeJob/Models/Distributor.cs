using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Proj_WeJob.Models.DAL;

namespace Proj_WeJob.Models.DAL
{
    public class Distributor
    {
        //Propeties 
        public string NameCompany { get; set; }
        public string NamePerson { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }

        //constructor
        public Distributor( string NameCompany, string NamePerson, string Phone, string Email) 
        {
            this.NameCompany = NameCompany;
            this.NamePerson = NamePerson;
            this.Phone = Phone;
            this.Email = Email;
        }

        public Distributor()
        {
        }

        //הכנסת נתונים לטבלה באמצעות קשירה לDB  
        public int InsertDistibutor()
        {
            DBservices dbs = new DBservices();
            return dbs.InsertDistibutor(this);
             
        }
        //הצגת כל המפיצים ללא סינון
        public List<Distributor> GetListDistributor()
        {
            DBservices dbs = new DBservices();
            return dbs.GetListDistributor("DBConnectionString");
        }

    }
}