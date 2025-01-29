# Seb VSCode
### Herramientas de VSCode mias y solo mias

Agrega iconos en la barra de estado para acceder rapidamente al repositorio GitHub y a la pagina de deploy,
configurables en el `package.json` del proyecto activo.

### Instalación
1. Compilar TS
```
npm i
npm run compile
```

2. Crear paquete VSIX
```
npx -y @vscode/vsce package
```

3. Presionar `Ctrl+Shift+P` en VScode y buscar `Install from VSIX`.

### Ejemplo de **package.json** en un proyecto:
```
{
  ...
  "repository": "https://github.com/voltuer/blah"
  "deployment_url": "http://vercel.com/voltuer/blah"
}
```



#### Resultado
<img width="300" alt="image" src="https://github.com/user-attachments/assets/19a3007e-df78-4a1d-b164-5dd94dd4b045">

# Extra ✨
Funciones bash/zsh para ver los links del repositorio y deployment<br>
Requieren `sudo apt install jq`
```
function url_r { link=$(jq -r '.repository // empty' package.json) 2&>/dev/null; [ $link ] && echo "  $link" }
function url_d { link=$(jq -r '.deployment_url // empty' package.json) 2&>/dev/null; [ $link ] && echo "  $link" }
function urls {
        link_repo=$(jq -r '.repository // empty' package.json) 2&>/dev/null
        link_deploy=$(jq -r '.deployment_url // empty' package.json) 2&>/dev/null
  [ ! $link_repo ] && [ ! $link_deploy ] && return
        printf "Links: "
        [ $link_repo ] && printf "\e]8;;$link_repo\e\\ \e]8;;\e\\"
        [ $link_deploy ] && printf "$([ $link_repo ] && printf " ")\e]8;;$link_deploy\e\\ \e]8;;\e\\"
  echo
}
function gp { git add -A; git commit -m "$*"; git push; urls }
function gg { git clone git@github.com:voltuer/$1; cd $1; urls }
```
