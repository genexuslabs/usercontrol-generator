using System;
using System.Collections.Generic;
//using System.Linq;
using System.Text;
//using System.Threading.Tasks;
using System.Diagnostics;

namespace elevate
{
    class Program
    {
        static void Main(string[] args)
        {
            string cmd = "";
            string sargs = "";

            for (int i = 0; i < args.Length; i++)
            {
                if (i == 0)
                    cmd = args[0];
                else {
                    sargs += args[i] + " ";
                    //Console.WriteLine(args[i]);
                }
                    
            }

            string curPath = System.IO.Directory.GetCurrentDirectory(); // AppDomain.CurrentDomain.BaseDirectory;

            sargs += "\"" + curPath.Trim() + "\"";
            //sargs += curPath;


            // System.IO.Directory.SetCurrentDirectory(curPath);

            Console.WriteLine(sargs);

            ProcessStartInfo startInfo = new ProcessStartInfo( "cmd.exe", "/C " + cmd + " " + sargs);
            
            startInfo.Verb = "runas";

            // startInfo.UseShellExecute = false;
            // startInfo.RedirectStandardInput = true;
            // startInfo.RedirectStandardOutput = true;

            startInfo.WorkingDirectory = curPath;
            startInfo.WindowStyle = ProcessWindowStyle.Normal;
            startInfo.CreateNoWindow = false;

            // Console.WriteLine(startInfo.WorkingDirectory);
            // Console.WriteLine(cmd);
            try
            {
                Process batch = Process.Start(startInfo);
                batch.WaitForExit();
            }catch{
                Console.WriteLine("We can't elevate permissions");
            }

        }
    }
}
