Esta es una web app para practicar el desarrollo de sofware, hecho mediante videos de la catedra de UTN FRRO DESARROLLO DE SOFTWARE, con material online y documentacion, videos de otros autores y demas.

Funcionalidad muy buena, mostrar como funciona

Detalles de instalacion de dependencias !!!!

Para que cualquier persona que descargue tu repositorio pueda instalar y correr la app, debe ejecutar estos comandos desde la raíz del proyecto:

-- pnpm install

Esto instalará todas las dependencias de backend y frontend gracias al pnpm-workspace.yaml.

Luego, en dos terminales diferentes:

--> c:\GastoFacil> cd backend

--> c:\GastoFacil\backend> pnpm dev

pnpm dev --> para correr backend | mostrara "Servidor corriendo en http://localhost:PORT"

--> c:\GastoFacil> cd frontend

--> c:\GastoFacil\frontend> pnpm dev

pnpm dev --> para correr el frontend | mostrara:

  ➜  Local:   http://localhost:PORT/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help

haz ctrl + click derecho en el link que te llevara a la pagina

//base de datos sqlite con prisma
npx prisma init --> crea los archivos para generar la base de datos

pnpm prisma migrate dev --name init --> para iniciar la base de datos y crear las tablas


omitir este paso
npx prisma migrate dev --name add-color-to-tipoGasto | agrega un atrubuto to Tabla
