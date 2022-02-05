namespace Reviewer.Storage
{
    using System;
    using System.Data.Entity;

    public class InternalStorage : DbContext
    {
        #region Properties

        public DbSet<Word> Words { get; set; }

        #endregion

        #region Constructors

        public InternalStorage(string dbConnection)
            : base(dbConnection)
        {
            if (!Database.Exists())
            {
                throw new Exception("База данных не обнаружена.");
            }
        }

        #endregion
    }
}
