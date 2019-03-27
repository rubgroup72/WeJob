using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Proj_WeJob.Models
{
    public class ReactResponse
    {
        public string Message { get; set; }
        public object Data { get; set; }

        public ReactResponse(string message, object data)
        {
            Message = message;
            Data = data;
        }
    }
}