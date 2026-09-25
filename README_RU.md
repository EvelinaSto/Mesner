# Сайт Елены Меснер — установка

Сайт работает на **Cloudflare Pages** (бесплатно) и хранится на **GitHub** (бесплатно).
Админка открывается по адресу `ваш-сайт/admin`, вход через аккаунт GitHub.
После каждого «Опубликовать» в админке сайт обновляется сам примерно за 1 минуту.

## Шаг 1. Загрузить файлы на GitHub
1. Зарегистрируйтесь на github.com.
2. Нажмите **+ → New repository**, назовите `elena-site`, выберите **Private**, нажмите **Create repository**.
3. На странице репозитория нажмите ссылку **uploading an existing file**.
4. Распакуйте архив и перетащите **всё содержимое папки `elena-site`** (папки `src`, `functions` и остальные файлы) в окно браузера. Нажмите **Commit changes**.

## Шаг 2. Подключить Cloudflare Pages
1. Зарегистрируйтесь на cloudflare.com.
2. **Workers & Pages → Create → вкладка Pages → Connect to Git**, подключите GitHub и выберите репозиторий `elena-site`.
3. Настройки сборки:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `_site`
4. Нажмите **Save and Deploy**. Через 1–2 минуты сайт будет доступен по адресу вида `elena-site.pages.dev`. **Запишите этот адрес.**

## Шаг 3. Разрешить вход в админку через GitHub
1. На GitHub: аватар → **Settings → Developer settings → OAuth Apps → New OAuth App**.
   - Application name: `Админка сайта`
   - Homepage URL: `https://elena-site.pages.dev` (ваш адрес из шага 2)
   - Authorization callback URL: `https://elena-site.pages.dev/api/callback`
2. Нажмите **Register application**. Скопируйте **Client ID**, затем **Generate a new client secret** и скопируйте секрет.
3. В Cloudflare: ваш проект → **Settings → Variables and Secrets → Add**:
   - `GITHUB_CLIENT_ID` = Client ID
   - `GITHUB_CLIENT_SECRET` = секрет (тип **Secret**)

## Шаг 4. Вписать свои данные в настройки админки
На GitHub откройте файл `src/admin/config.yml` → значок карандаша и замените:
- `ВАШ-GITHUB-ЛОГИН/elena-site` → ваш логин и имя репозитория
- оба `https://ИМЯ-ПРОЕКТА.pages.dev` → ваш адрес из шага 2

Нажмите **Commit changes**. Cloudflare сам пересоберёт сайт.

## Шаг 5. Войти в админку
Откройте `https://elena-site.pages.dev/admin` → **Войти через GitHub**.
В разделе «Страницы → Сайт и контакты» заполните: адрес сайта, WhatsApp, Impressum, Datenschutzerklärung.

**Дать доступ Елене:** она регистрируется на GitHub, а вы в репозитории **Settings → Collaborators → Add people** добавляете её логин.

## Шаг 6. Свой домен
Cloudflare → проект → **Custom domains → Set up a custom domain** → введите домен и следуйте подсказкам
(проще всего перенести домен на бесплатные DNS Cloudflare — мастер покажет, что поменять у регистратора).
После подключения поменяйте «Адрес сайта» в админке на новый домен.
Настройки OAuth и `config.yml` можно не трогать — вход продолжит работать через адрес `.pages.dev`.

## Где что лежит
- `src/_data/*.json` — тексты (их меняет админка)
- `src/_data/landings/` — лендинги, по одному файлу на страницу
- `src/images/uploads/` — загруженные фото
- `src/assets/` — дизайн, шрифты (хранятся на сайте, без Google Fonts — DSGVO)
- `functions/api/` — вход в админку через GitHub
