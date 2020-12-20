# Implementarea functionalitatii de autentificare in React

## Informatii generale

Sirul commit-urilor il regasiti [aici](https://github.com/pantelimonfl/webtech-store/commits/main), am adaugat incremental toate cele necesare functionalitatii nou create. 

![commits](https://i.imgur.com/jFx0xKE.png)

## Procesul de autentificare

Procesul de autentificare a fost impartit in doua parti: autentificarea clasica, cu adresa de e-mail si parola si autentificarea utilizand un serviciu extern.

In cazul ambelor procese de autentificare, rezultatul final va fi un JWT ([JSON Web Token](https://jwt.io/)) returnat de catre server si stocat de aplicatia react cu ajutorul obiectului localStorage.

### Autentificarea clasica - [Vezi sectiunea](https://github.com/pantelimonfl/webtech-store/blob/main/README-AUTH.md#autentificarea-clasica)

1. Utilizatorul introduce adresa de e-mail si parola.
2. Se apeleaza endpoint-ul '/api/users/login' cu parametrii e-mail si parola.
3. Se verifica daca exista un utilizator cu credentialele specificate.
4. In caz afirmativ, se va intoarce un token ce atesta autenticitatea utilizatorului.

### Autentificarea cu Google [Vezi sectiunea](https://github.com/pantelimonfl/webtech-store/blob/main/README-AUTH.md#implementarea-autentificarii-cu-serviciul-extern---google)

1. Utilizatorul apasa butonul "Log-in with Google".
2. Se deschide fereastra prin care se alege un cont sau se introduc credentialele Google (fereastra de autentificare cu google nu este controlata de catre noi, prin urmare nu avem acces la datele introduse de utilizator)
3. In cazul in care autentificarea cu Google a reusit, se va intoarce un obiect JSON cu cateva date despre utilizator ([vezi sectiunea Google](https://github.com/pantelimonfl/webtech-store/blob/main/README-AUTH.md#implementarea-autentificarii-cu-serviciul-extern---google)) si un token care va fi transmis server-ului.
4. Se creeaza un request catre server prin care se paseaza token-ul primit de la Google.
5. Serverul, la randul sau, creeaza un request catre Google prin care verifica token-ul primit.
6. In cazul in care token-ul este autentic si contine datele despre utilizator, se extrage adresa de e-mail si:
6.1. In cazul in care adresa nu exista in baza de date, contul se creeaza si se intoarce catre aplicatia React un JWT valid.
6.2. In cazul in care adresa exista, se intoarce direct JWT generat.


## 1. Organizarea aplicatiei - [Link commit](https://github.com/pantelimonfl/webtech-store/commit/c14c1bd91e28381bd6f01e9e003e561d0ecd844e)

Am inceput prin a reorganiza aplicatia, astfel am creat doua noi directoare: Components si Services. 
In directorul Components am mutat toate fisierele aferente componentelor, iar in folderul Services am adaugat (intr-un commit ulterior) modulul UserService.

## 2. Adaugarea metodelor pe server - [Link commit](https://github.com/pantelimonfl/webtech-store/commit/d7cb46f7f884db0294066f5243571eb16710d372)

Am adaugat pe server metoda generateJWT, ce primeste ca parametru un obiect **payload** si un **secret**, iar in final retuneaza, cu ajutorul librariei **jsonwebtoken**,
un JWT care va fi stocat local in aplicatia React.

```javascript
function generateJwt(payload) {
  var token = jwt.sign(payload, superSecret, {
    expiresIn: "1h",
    issuer: "WebTechAuth",
  });

  return token;
}
```

Pe endpoint-ul **/login** am apelat metoda descrisa mai sus pentru a transmite JWT-ul nou creat ca raspuns.

## 3. Adaugarea unei pagini de login - [Link commit](https://github.com/pantelimonfl/webtech-store/commit/88adc8d0cb62f3aaa128193c60c302257c8ae6c5)

In continuare, am adaugat o pagina de login simpla, fara functionalitate. Pagina a fost luata de [aici](https://bootsnipp.com/snippets/dldxB), fiind aduse cateva modificari 
pentru a se potrivi functionalitatii noastre.

Pagina contine, in acest moment un obiect de stare ce retine adresa de e-mail si parola utilizatorului, pentru a putea fi trimise catre server:
```javascript
this.state = {
      email: "",
      password: "",
    };
```


## 4. Adaugarea unei componente Main - [Link commit](https://github.com/pantelimonfl/webtech-store/commit/59fe6825579afebc9320c7fbcef827f62f0b2790)

Pentru a separa pagina login de restul aplicatiei, am creat o noua componenta care inglobeaza restul aplicatiei noastre,
iar in componenta App.js am lasat doar componenta Main si componenta Login

### App.js
```javascript
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <ProtectedRoute path="/" component={Main} />
      </Switch>
    </Router>
  );
}
```

### Main.js
```javascript
class Main extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Menu />
          <Switch>
            <Route path="/orders" component={Orders} />
            <Route path="/users" component={Users} />
            <Route path="/products" component={ProductList} />
            <Route path="/product/:id" component={ProductPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}
```

## 5. Adaugarea serviciului UserService - [Link commit](https://github.com/pantelimonfl/webtech-store/commit/e2c90c924c51c55fb2c18533f01f0aea6c011f00)

In continuare, am creat un serviciu *UserService.js*, unde am scris toata logica aferenta operatiunilor cu utilizatorul. Astfel, acesta exporta urmatoarele metode:

- login(email, password) - Metoda ce este apelata din componenta Login.js si creeaza request-ul catre server, iar apoi seteaza in localStorage token-ul primit.
- logout() - Metoda ce este apelata cand vrem sa stergem token-ul stocat local.
- isLoggedIn() - Metoda ce returneaza true, in cazul in care in localStorage exista item-ul cu cheia *auth_token* si false, daca nu exista.
- getUserData() - Metoda ce returneaza un obiect ce contine adresa de e-mail si numele utilizatorului.

### Exemplu metoda login(email, password)
```javascript
function login(email, password) {
  const loginEndpoint = `http://localhost:8000/api/users/login?Email=${email}&Password=${password}`;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  return fetch(loginEndpoint, requestOptions)
    .then(handleResponse)
    .then((token) => {
      if (token) {
        localStorage.setItem("auth_token", token);
      }

      return token;
    });
}
```

## 6. Legarea componentei Login de UserService - [Link commit](https://github.com/pantelimonfl/webtech-store/commit/7a3f2260b9f3c09f0da84d5bd401a4c697931100)

In continuare, am utilizat serviciul *UserService* in componenta *Login.js*, apeland metodele *logout()* la incarcarea paginii (pentru a sterge token-ul existent)
si *login()* pentru a autentifica utilizatorul.

Metoda *handleLogin(e)*, prezentata mai jos, apeleaza metoda *login()* din *UserService*, apoi redirecteaza utilizatorul catre componenta *Main* dupa ce s-a realizat autentificarea.

```javascript
handleLogin(e) {
    e.preventDefault();
    const { email, password } = this.state;

    if (!(email && password)) {
      return;
    }

    UserService.login(email, password).then(() => {
      const { from } = {
        from: { pathname: "/" },
      };
      this.props.history.push(from);
    });
  }
```

## 7. Adaugarea unei componente *ProtectedRoute* - [Link commit](https://github.com/pantelimonfl/webtech-store/commit/edab6d05f4cc29cccc0f98c3d28d424712ac3396)

Mai departe, am creat o noua componenta numita *ProtectedRoute* pe care o vom utiliza pentru a "proteja" componentele din aplicatia noastra astfel incat sa poata fi accesate
doar de catre utilizatorii autentificati.

Practic, componenta ProtectedRoute imbraca componenta Route si permite accesul doar pentru utilizatorii autentificati. In cazul in care utilizatorul nu este autentificat,
se realizeaza redirectarea catre "/login".

```javascript
export const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      UserService.isLoggedIn() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: "/login", state: { from: props.location } }}
        />
      )
    }
  />
);
```

## Implementarea autentificarii cu serviciul extern - Google

### Obtinerea cheii de aplicatie

Pentru a putea accesa serviciul de autentificare oferit de Google, avem nevoie de o cheie pe care o putem obtine astfel:

1. Accesam [Google Developer Console](https://console.developers.google.com/)

![dashboard](https://i.imgur.com/Pdqjwhu.png)

2. Deschidem un nou proiect, pe care il vom numi Webtech-Auth

![proiectnou](https://i.imgur.com/p1B1ZDk.png)

3. Inainte de a obtine cheia, trebuie sa configuram fereastra de consimtamant pe care o va vedea utilizatorul cand va apasa butonul de login. 

Astfel, selectam *External*, ca target al aplicatiei noastre, iar apoi introducem numele aplicatiei si adresa de mail 
(+ adresa de mail a developer-ului in josul paginii) si continuam, trecand peste scopes si test users.

4. Navigam pe tab-ul credentials si apasam *Create credentials*, selectand *OAuth Client ID*.

![oauth](https://i.imgur.com/owEgEaP.png)

5. In meniul *Application Type* selectam *Web Application*.

6. Adaugam numele aplicatiei noastre si la *Enabled Javascript Origins* completam cu *http://localhost:3000*, aceasta fiind adresa aplicatiei noastre rulata local.

7. Dupa creare, vom pastra Client ID-ul generat (acesta poate fi vazut si ulterior) si il vom utiliza in componenta *GoogleAuth.js*

## Token-ul generat de Google

Dupa ce utilizatorul alege autentificarea cu Google, se va obtine urmatorul token:

![token google](https://i.imgur.com/yqgEXLh.png)

Din acest obiect, se va trimite catre serverul nostru *tokenId*, care va fi ulterior validat printr-un request catre
[https://oauth2.googleapis.com/tokeninfo?id_token=xxxzzzyyy](https://oauth2.googleapis.com/tokeninfo?id_token=xxxyyyzzz).

Astfel, prin acest request vom obtine urmatoarele date:

![date](https://i.imgur.com/qNHEVpF.png)

In cazul in care token-ul nu este valid, Google va returna un raspuns specific, iar autentificarea nu se va putea realiza.

## 8. Adaugarea endpoint-ului pe server - [Link commit](https://github.com/pantelimonfl/webtech-store/commit/5eda864581040f776168f9c6b3d430458181cba9)

Intr-o prima faza, am instalat libraria *axios* pentru a putea crea request-uri HTTP din serverul nostru express.
Mai departe, am adaugat un nou endpoint *api/google/login/:token* ce primeste ca parametru token-ul initial de la Google, apoi il verifica, iar daca este autentic,
intoarce un JWT ce va fi stocat de catre aplicatia React.

Astfel, serverul primeste token-ul pe care aplicatia React il primeste la randul sau de la Google si creeaza un request catre *checkTokenEndpoint*.
Din raspunsul primit, extrage adresa de e-mail, iar daca aceasta nu exista in baza de date, creeaza un cont cu aceasta adresa, iar in cazul in care exista,
genereaza un JWT ce contine adresa de e-mail si numele acestuia.

```javascript
app.get("/api/google/login/:token", (req, result) => {
  const checkTokenEndpoint = `https://oauth2.googleapis.com/tokeninfo?id_token=${req.params.token}`;
  axios
    .get(checkTokenEndpoint)
    .then((res) => {
      User.findOne({
        where: {
          Email: res.data.email,
        },
        attributes: ["UserId", "Name", "Email"],
      }).then((userAccount) => {
        if (userAccount) {
          let payload = {
            Email: userAccount.Email,
            Name: userAccount.Name,
          };
          result.status(200).send(generateJwt(payload));
        } else {
          User.create({
            Name: res.data.name,
            Email: res.data.email,
            Password: 0,
          }).then(() => {
            let payload = {
              Email: res.data.email,
              Name: res.data.name,
            };
            result.status(200).send(generateJwt(payload));
          });
        }
      });
    })
    .catch((err) => console.log(err));
});
```

## 9. Adaugarea librariei react-google-login si implementarea functiei de autentificare - [Link commit](https://github.com/pantelimonfl/webtech-store/commit/d64c17d018d89e445446195ef4fe582b029f0519)

9.1. In prima faza am instalat libraria *react-google-login*, librarie care expune o interfata *mai* usoara de autentificare cu serviciul extern Google.
9.2. Am adaugat componenta *GoogleAuth*, care reprezinta butonul care va deschide fereastra de autentificare. In cadrul acestei componente am adaugat butonul, 
reprezentat printr-o componenta numita *GoogleLogin* ce contine o proprietate *clientId*. Aici vom introduce codul nostru de client obtinut de la Google.

Pe proprietatea onSuccess am declarat event handler-ul *handleResponse*, care trimite mai departe catre *UserService* token-ul primit pentru a fi validat.

```javascript
render() {
    return (
      <GoogleLogin
        clientId="xxxyyyzzz"
        buttonText="Login with Google"
        onSuccess={this.handleResponse}
        cookiePolicy={"single_host_origin"}
      />
    );
  }
```

9.3. Am adaugat in *UserService* metoda care realizeaza request-ul de verificare a token-ului primit de la Google.
Metoda *googleLogin* din *UserService* creeaza un request catre server in care trimite ca parametru token-ul primit de la Google. In cazul in care token-ul este validat,
va primi inapoi un JWT pe care il va stoca la nivel local.

```javascript
function googleLogin(token) {
  const loginEndpoint = `http://localhost:8000/api/google/login/${token}`;
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  return fetch(loginEndpoint, requestOptions)
    .then(handleResponse)
    .then((token) => {
      if (token) {
        localStorage.setItem("auth_token", token);
      }

      return token;
    });
}
```

9.4. Am adaugat butonul de autentificare cu Google in pagina de login.

