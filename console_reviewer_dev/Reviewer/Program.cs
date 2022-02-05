namespace Reviewer
{
    using System;

    internal class Program
    {
        #region Methods

        private static void Main(string[] args)
        {
            try
            {
                var reviewParams = new ReviewParams
                {
                    PathDocument = args[0],
                    UseGlobalDictionary = Convert.ToBoolean(args[1]),
                    UseOwnDictionary = Convert.ToBoolean(args[2]),
                    PathOwnDictionary = args.Length < 4 ? null : args[3]
                };
                var reviewManager = new ReviewManager(reviewParams);
                reviewManager.Review();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
            }
        }

        #endregion

        //private static void Main(string[] args)
        //{
        //    try
        //    {
        //        var reviewParams = new ReviewParams
        //        {
        //            PathDocument = @"C:\Users\deaf\source\repos\Reviewer\Reviewer\bin\Debug\NIRSSakharov_v2.docx",
        //            UseGlobalDictionary = true,
        //            UseOwnDictionary = false,
        //            PathOwnDictionary = null
        //        };
        //        var reviewManager = new ReviewManager(reviewParams);
        //        reviewManager.Review();
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex.Message);
        //    }
        //    Console.WriteLine("done");
        //    Console.ReadKey();
        //}
    }
}
