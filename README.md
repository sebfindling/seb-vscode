# Seb VSCode
### Herramientas de VSCode mias y solo mias

Agrega iconos en la barra de estado para acceder rapidamente al repositorio GitHub y a la pagina de deploy,
configurables en el `package.json` del proyecto activo.

### Instalación
1. Crear paquete VSIX
```
npx @vscode/vsce package
```
2. Presionar `Ctrl+Shift+P` en VScode y buscar `Install from VSIX`.

### Ejemplo de **package.json** en un proyecto:
```
{
  ...
  "repository": "https://github.com/voltuer/blah"
  "deployment_url": "http://vercel.com/voltuer/blah"
}
```



#### Resultado
