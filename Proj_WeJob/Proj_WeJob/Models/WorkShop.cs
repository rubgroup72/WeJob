using Proj_WeJob.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Proj_WeJob.Models
{
    public class WorkShop
    {
        public int WorkShopCode { get; set; }
        public string WorkShopName { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public DateTime Date { get; set; }
        public TimeSpan FromHour { get; set; }
        public TimeSpan ToHour { get; set; }
        public int MaxParticipants { get; set; }
        public int MinParticipants { get; set; }
        public int NoOfRegisters { get; set; }
        public int Price { get; set; }
        public string WorkshopBy { get; set; }
        public string Flyer { get; set; }

        public WorkShop(string WorkShopName, string Description, string Location,
             DateTime Date, TimeSpan FromHour, TimeSpan ToHour, int MaxParticipants,
            int MinParticipants,int NoOfRegisters, int Price, string WorkshopBy, string Flyer)
        {
            this.WorkShopName = WorkShopName;
            this.Description = Description;
            this.Location = Location;
            this.Date = Date;
            this.ToHour = ToHour;
            this.FromHour = FromHour;
            this.MaxParticipants = MaxParticipants;
            this.MinParticipants = MinParticipants;
            this.NoOfRegisters = NoOfRegisters;
            this.Price = Price;
            this.WorkshopBy = WorkshopBy;
            this.Flyer = Flyer;
        }
        public WorkShop()
        {

        }
        public List<WorkShop> GetListWorkShop()
        {
            DBservices dbs = new DBservices();
            return dbs.GetListWorkShop("DBConnectionString");
        }
    }
}