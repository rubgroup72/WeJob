using Proj_WeJob.Models.DAL;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;

namespace Proj_WeJob.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class AppStudentGetCVController : ApiController
    {
        [HttpGet]
        public HttpResponseMessage Get(string studentId)
        {
            int studnetIdInt;
            if (String.IsNullOrEmpty(studentId) || !int.TryParse(studentId, out studnetIdInt))
                return null;
            var s = new Student
            {
                StudentId = studnetIdInt
            };
            var cv = s.GetCV();

            var dataStream = new MemoryStream(Convert.FromBase64String(cv.Value));

            HttpResponseMessage httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK);
            httpResponseMessage.Content = new StreamContent(dataStream);
            httpResponseMessage.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            httpResponseMessage.Content.Headers.ContentDisposition.FileName = cv.Key;
            httpResponseMessage.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");

            return httpResponseMessage;
        }
    }
}
