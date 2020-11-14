using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(OnlineReviewer.Startup))]
namespace OnlineReviewer
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
