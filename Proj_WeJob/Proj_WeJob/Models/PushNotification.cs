using Newtonsoft.Json;
using Proj_WeJob.Controllers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;

namespace Proj_WeJob.Models
{
    public static class PushNotification
    {
        private static string SERVER_KEY = "AAAA9Y0WtX4:APA91bHORzigKTjNX7sGYxbFq-Nvqt8nI5zaPrvBAyTm7TQJ8DXRe1QzYLwMC_r7DWgQ8eNU6ICu28H60-9deIXYCCBzaLaLIicIqd1Ff5ZhR9jWTcTA0ImQoATQcQzWWWAFBVQUMNvi";
        private static string SENDER_ID = "1054634063230";

        public static void SendPushNotification(string title, string body, string fcmToken)
        {
            WebRequest tRequest = WebRequest.Create("https://fcm.googleapis.com/fcm/send");
            tRequest.Method = "post";
            //serverKey - Key from Firebase cloud messaging server  
            tRequest.Headers.Add(string.Format("Authorization: key={0}", SERVER_KEY));
            //Sender Id - From firebase project setting  
            tRequest.Headers.Add(string.Format("Sender: id={0}", SENDER_ID));
            tRequest.ContentType = "application/json";
            var payload = new
            {
                to = fcmToken,
                priority = "high",
                content_available = true,
                notification = new
                {
                    body = body,
                    title = title,
                    badge = 1
                },
            };

            string postbody = JsonConvert.SerializeObject(payload).ToString();
            Byte[] byteArray = Encoding.UTF8.GetBytes(postbody);
            tRequest.ContentLength = byteArray.Length;
            using (Stream dataStream = tRequest.GetRequestStream())
            {
                dataStream.Write(byteArray, 0, byteArray.Length);
                using (WebResponse tResponse = tRequest.GetResponse())
                {
                    using (Stream dataStreamResponse = tResponse.GetResponseStream())
                    {
                        if (dataStreamResponse != null) using (StreamReader tReader = new StreamReader(dataStreamResponse))
                        {
                            String sResponseFromServer = tReader.ReadToEnd();
                        }
                    }
                }
            }
        }
    }
}