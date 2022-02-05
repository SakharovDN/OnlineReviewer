namespace Reviewer
{
    using System;
    using System.Collections.Generic;

    using Newtonsoft.Json;

    using Services;

    using Storage;

    public class ReviewManager
    {
        #region Fields

        private readonly ReviewParams _reviewParams;
        private readonly InternalStorage _storage;
        private readonly ReviewService _reviewService;

        #endregion

        #region Constructors

        public ReviewManager(ReviewParams reviewParams)
        {
            _reviewParams = reviewParams;
            _storage = new InternalStorage("Reviewer");
            _reviewService = new ReviewService(_storage);

            if (!reviewParams.UseOwnDictionary)
            {
                return;
            }

            var ownDictionary = JsonConvert.DeserializeObject<List<Word>>(_reviewParams.PathOwnDictionary);
            _reviewService.SetOwnDictionary(ownDictionary);
        }

        #endregion

        #region Methods

        public void Review()
        {
            _reviewService.OpenDoc(_reviewParams.PathDocument);

            if (_reviewParams.UseGlobalDictionary)
            {
                _reviewService.FindUnwantedGlobalWords();
            }

            if (_reviewParams.UseOwnDictionary)
            {
                _reviewService.FindUnwantedOwnWords();
            }

            _reviewService.CloseDoc();
            Console.Out.WriteLine(_reviewService.GetMistakesNumber());
        }

        #endregion
    }
}
