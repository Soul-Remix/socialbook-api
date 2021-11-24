# Socialbook API


Socialbook API is an API server for a social media web app.     
Written in [TS](https://www.typescriptlang.org/), using [Nestjs](https://nestjs.com/) as the framework,
[PostgreSQL](https://www.postgresql.org/) as the DB, [Prisma](prisma.io/) orm & Deployed at [Heroku](https://heroku.com/).    

To read about the features go to: 
[Frontend Repo](https://github.com/Soul-Remix/socialbook).    

[SocialBook](https://social-book-app.netlify.app/home).    

One of the biggest challenges for me when i started to build this API was that i decided to use a new stack, other than what i was used to before.    

I had to start by learning TS, I have been planning on learning it for a while, 
So i just picked it up and started writing and this might actually show in the code since i sometimes just ended up using any instead of writing a type 
but i'm planning on going back and change all those any to the right type.    

After i started learning TS, I looked for a framework that plays well with TS and i settled on NestJS, 
It was a big jump from what i was used to in express but i enjoyed working with it.    
Then i looked into learning more about SQL and postgres.    

Another big hurdle was working on getting a functional Liva Chat Messaging using websockets and nestjs

## Installation

```
git clone https://github.com/Soul-Remix/socialbook-api.git
cd socialbook-api
npm install
```

create .env file and add the following:
```
DATABASE_URL=<Your DB URL>
JWTSECRET=<Your jwt secret>
```

finally:
```
npm run start
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
