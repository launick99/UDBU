-- simple tablita para probar fetch y post
-- eventualmente la voy a extender para contener id de usuario, imagen quiza, etc..
create table publicaciones (
    id serial primary key,
    content text not null,
    created_at timestamp with time zone default now()
);