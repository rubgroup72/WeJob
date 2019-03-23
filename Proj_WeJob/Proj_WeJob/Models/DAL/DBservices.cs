using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Web.Configuration;
using System.Data;
using System.Text;
using Proj_WeJob.Models;
using System.Drawing;
using System.IO;
using System.Drawing.Imaging;


namespace Proj_WeJob.Models.DAL
{
    public class DBservices
    {
        //connection string details
        private String connectionString = "DBConnectionString";

        public DBservices()
        {
            //
            // TODO: Add constructor logic here
            //
        }
        //--------------------------------------------------------------------------------------------------
        // This method creates a connection to the database according to the connectionString name in the web.config 
        //--------------------------------------------------------------------------------------------------
        public SqlConnection connect(String conString)
        {
            // read the connection string from the configuration file
            string cStr = WebConfigurationManager.ConnectionStrings[conString].ConnectionString;
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }
        //--------------------------------------------------------------------------------------------------
        // This method inserts a person to the persons table 
        //--------------------------------------------------------------------------------------------------
        private SqlCommand CreateCommand(String CommandSTR, SqlConnection con)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = CommandSTR;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.Text; // the type of the command, can also be stored procedure

            return cmd;
        }

        ///+++++++++הוספת מפיץ חדש++++++++++++++++++
        public int InsertDistibutor(Distributor distributor)
        {
            SqlConnection con;
            SqlCommand cmd;
            try
            {
                con = connect("DBConnectionString"); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            String cStr = BuildInsertDistributor(distributor);      // helper method to build the insert string
            cmd = CreateCommand(cStr, con);             // create the command
            try
            {
                return Convert.ToInt32(cmd.ExecuteScalar());
                //int numEffected = cmd.ExecuteNonQuery(); // execute the command
            }
            catch (Exception ex)
            {
                return 0;
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }
        //--------------------------------------------------------------------
        // Build the Insert a movie command String
        //--------------------------------------------------------------------
        private String BuildInsertDistributor(Distributor dis)
        {
            String command;
            StringBuilder sb = new StringBuilder();
            // use a string builder to create the dynamic string
            sb.AppendFormat(" Values ('{0}','{1}','{2}','{3}') ",dis.NameCompany,dis.NamePerson,dis.Phone,dis.Email);
            String prefix = "INSERT INTO Company " + "(CompanyName,ContactName,ContactPhone,ContactMail)";
            command = prefix + sb.ToString();
            command += "; SELECT SCOPE_IDENTITY()";
            return command;
        }
        ///++++++++++סיום הוספת משתמש+++++++++++

        //+++++פונקציה שמחזיה רשימה של מפיצים ללא סינון
        public List<Distributor> GetListDistributor(string conString)
        {
            SqlConnection con = null;
            List<Distributor> ld = new List<Distributor>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT * FROM Company";
                SqlCommand cmd = new SqlCommand(selectSTR, con);
                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {   // Read till the end of the data into a row
                    Distributor d = new Distributor
                        (
                        Convert.ToInt32(dr["CompanyNo"]),
                        Convert.ToString(dr["CompanyName"]),
                        Convert.ToString(dr["ContactName"]),
                        Convert.ToString(dr["ContactPhone"]),
                        Convert.ToString(dr["ContactMail"])
                        );
                    ld.Add(d);
                }

                return ld;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        //+++++פונקציה שמחזיה רשימה של סטודנטים ללא סינון
        public List<Student> GetListStudent(string conString)
        {
            SqlConnection con = null;
            List<Student> ld = new List<Student>();
            try
            {
                con = connect(conString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "SELECT * FROM Student";
                SqlCommand cmd = new SqlCommand(selectSTR, con);
                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {   // Read till the end of the data into a row
                    Student s = new Student
                        (
                        Convert.ToInt32(dr["StudentID"]),
                        Convert.ToString(dr["FirstName"]),
                        Convert.ToString(dr["LastName"]),
                        Convert.ToString(dr["CellPhone"]),
                        Convert.ToString(dr["Email"])
                        );
                    ld.Add(s);
                }

                return ld;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        //++++ פונקציית התחברות מאפליקציה לבסיס הנתונים
        public Student AppLogin(String email, String password)
        {
            SqlConnection con = null;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file
                var selectSTR = "SELECT * FROM Student Where email = '" + email + "' and Password = '" + password + "'";
                var cmd = new SqlCommand(selectSTR, con);
                // get a reader
                SqlDataReader dr = cmd.ExecuteReader(CommandBehavior.CloseConnection); // CommandBehavior.CloseConnection: the connection will be closed after reading has reached the end
                while (dr.Read())
                {   // Read till the end of the data into a row
                    Student s = new Student
                        (
                        Convert.ToInt32(dr["StudentID"]),
                        Convert.ToString(dr["FirstName"]),
                        Convert.ToString(dr["LastName"]),
                        Convert.ToString(dr["CellPhone"]),
                        Convert.ToString(dr["Email"])
                        );
                    return s;
                }
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return null;
        }

        //פונקציית הרשמה של סטודנט חדש
        public Student Register(String email, String firstName, String lastName, String phoneNumber, String password)
        {
            SqlConnection con = null;
            List<Student> currentStudentList = GetListStudent(connectionString);

            // Check if email already exists
            if (currentStudentList.Any(stud => stud.Email == email))
                return null;

            // Calc new studentId
            var studentId = currentStudentList.Count() + 1;
            try
            {
                con = connect(connectionString); // create a connection to the database using the connection String defined in the web config file
                String selectSTR = "Insert Into Student (StudentId, DepartmentDepartmentCode, FirstName,LastName,Email,CellPhone,Password) Values";
                selectSTR += String.Format("({0},{1},'{2}','{3}','{4}','{5}','{6}')", studentId, 1, firstName, lastName, email, phoneNumber, password);
                var cmd = CreateCommand(selectSTR, con);
                cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
            return AppLogin(email, password);
        }
    }
}
