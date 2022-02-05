namespace Reviewer.Services
{
    using System.Collections.Generic;
    using System.Threading;

    using Microsoft.Office.Interop.Word;

    using Storage;

    public class ReviewService
    {
        #region Fields

        private readonly InternalStorage _storage;
        private List<Word> _ownDictionary;
        private readonly Application _app;
        private Document _doc;
        private int _mistakesNumber;
        private readonly List<Thread> _reviewThreads;

        #endregion

        #region Constructors

        public ReviewService(InternalStorage storage)
        {
            _storage = storage;
            _mistakesNumber = 0;
            _app = new Application
            {
                Visible = false
            };
            _reviewThreads = new List<Thread>();
        }

        #endregion

        #region Methods

        public void SetOwnDictionary(List<Word> ownDictionary)
        {
            _ownDictionary = ownDictionary;
        }

        public void OpenDoc(string path)
        {
            object docPath = path;
            _doc = _app.Documents.Open(ref docPath);
        }

        public void FindUnwantedGlobalWords()
        {
            FindUnwantedWords(_storage.Words);
        }

        public void FindUnwantedOwnWords()
        {
            FindUnwantedWords(_ownDictionary);
        }

        public void CloseDoc()
        {
            object saveChanges = WdSaveOptions.wdSaveChanges;
            object originalFormat = WdOriginalFormat.wdOriginalDocumentFormat;
            _app.Quit(ref saveChanges, ref originalFormat);
        }

        public int GetMistakesNumber()
        {
            return _mistakesNumber;
        }

        private void FindUnwantedWords(IEnumerable<Word> dictionary)
        {
            foreach (Word word in dictionary)
            {
                var task = new Thread(() => RunCycle(word))
                {
                    IsBackground = true
                };
                _reviewThreads.Add(task);
                task.Start();
            }

            foreach (Thread thread in _reviewThreads)
            {
                thread.Join();
            }
        }

        private void RunCycle(Word word)
        {
            Range range = _doc.Content;
            range.Find.ClearFormatting();
            range.Find.Forward = true;
            range.Find.MatchWholeWord = true;
            range.Find.Text = word.Value;
            range.Find.Execute();

            while (range.Find.Found)
            {
                _mistakesNumber++;
                range.Comments.Add(range, word.Comment);
                range.Find.Execute();
            }
        }

        #endregion
    }
}
