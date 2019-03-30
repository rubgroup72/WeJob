using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml.XPath;

namespace Proj_WeJob.Models.DAL
{
    public class XML_Sevices
    {

        // ****************** Read an RSS file ***************************/
        public List<string> ReadRss()
        {

            //  Using a live RSS feed.
            string RSSFileName = "https://data.gov.il/dataset/3fc54b81-25b3-4ac7-87db-248c3e1602de/resource/a68209f0-8b97-47b1-a242-690fba685c48/download/yeshuvim_20190301.xml";

            // find all the titles in the items
            String xpath = "//item/title";

            try
            {
                List<string> list = ReadXMLField(RSSFileName, xpath);
                return list;
            }
            catch (Exception ex)
            {
                throw new Exception("faild to read the XML file, The error is " + ex.Message);
            }

        }
        // ***** returns a list of a specific field within a given XML file *******/
        public List<string> ReadXMLField(string xmlFile, string xpath)
        {

            List<string> list = new List<string>();

            // This is the class you want to work with when using Xpath
            XPathDocument doc = new XPathDocument(xmlFile);

            // Create a navigator
            XPathNavigator nav = doc.CreateNavigator();

            foreach (XPathNavigator node in nav.Select(xpath))
            {
                list.Add(node.Value);
            }

            return list;
        }
    }
}