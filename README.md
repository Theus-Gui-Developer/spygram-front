# Front

Setup Svelte 5 + TypeScript + Vite para app estático simples, com roteamento por hash.

## Comandos

```bash
npm install
npm run dev
npm run check
npm run build
```

## Deploy em VPS simples

Depois do build, suba o conteúdo da pasta `dist/` para o diretório público da VPS.

As rotas usam hash, então funcionam sem Nginx, Apache rewrite ou fallback para `index.html`:

```txt
/#/
/#/arquivos
/#/configuracoes
```

O Vite está com `base: './'` em `vite.config.ts`, então os assets são referenciados de forma relativa e o app pode rodar em subpastas.
