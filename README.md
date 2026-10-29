# SK Energy — website (v3)

Static site, no build step. Vercel serves it as-is.

| Page | File | URL |
|---|---|---|
| Home | index.html | / |
| About | about.html | /about |
| Services | service.html | /service?slug=solar-pv |
| Work | work.html | /work |
| Case study | case-study.html | /case-study?slug=kinross-farmhouse |
| News | news.html | /news |
| Article | news-article.html | /news-article?slug=… |
| Contact | contact.html | /contact |
| Warranty | warranty-registration.html | /warranty-registration |

Content comes from Sanity (project `acn2l2rb`, see `cms/config.js`). Until the dataset is imported, public and has this site's domain in its CORS origins, pages show the sample content in `cms/*.json`.

Forms are front-end only — connect them to a form handler before launch.
