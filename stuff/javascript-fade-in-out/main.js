/**
 * Fade In & Out - pmav.eu
 * v1.3.0 - 18/Set/2006
 */


// Tempo de transi��o entre "frame" no fade in/out.
var waitFrame = 60;



// Verifica se � IE o browser utilizado.
var ie = (navigator.appName == "Microsoft Internet Explorer") ? true : false;



// Guarda os valores de lock, utilizados para obrigar a execu��o de um fade in/out at� ao final
// No caso do valor lock a true todos os "mouse over/out" s�o ignorados mas o fluxo de execu��o continua (VAR s).
var lock  = new Array();



// Mem�ria sobre o que fazer quando termina um fadeIn/Out
var state = new Array();



// Devolve o estado de LOCK/UNLOCK para um objecto.
function status(s) {
 if (lock[s])
  return true;
 else
  return false;
}



// Fun��o de lan�amento do Fade In.
function fadeIn(e) {
 state[e] = true;
 fadeInExec(e, 0.2, false);
}



// Fun��o de lan�amento do Fade Out.
function fadeOut(e) {
 state[e] = false;
 fadeOutExec(e, 1, false);
}



/**
 * fadeInExec(e:string{html id imagem}, j:int{iterador Fade In}, s:boolean{overwrite para lock})
 * Efectua o Fade In da imagem e verifica o passo seguinte: Fade Out ou manter
 */
function fadeInExec(e, j, s) {
 if (!status(e) || s) { // If unlocked or TRUE
  lock[e] = true; // Lock
  img = document.getElementById(e);
  if (j != 1.1) {
   if (ie) img.style.filter = "alpha(opacity="+(j*100)+")"; else img.style.opacity = j;
   setTimeout("fadeInExec(\""+e+"\", "+(Math.round((j+0.1)*10)/10)+", true)", waitFrame);
  } else {
   lock[e] = false; // Unlock
   if (!state[e]) fadeOut(e) // Verifica Estado
  }
 }
}



/**
 * fadeOutExec(e:string{html id imagem}, j:int{iterador Fade Out}, s:boolean{overwrite para lock})
 * Efectua o Fade Out da imagem e verifica o passo seguinte: Fade In ou manter
 */
function fadeOutExec(e, j, s) {
 if (!status(e) || s) { // If unlocked or TRUE
  lock[e] = true; // Lock
  img = document.getElementById(e);
  if (j != 0.1) {
   if (ie) img.style.filter = "alpha(opacity="+(j*100)+")"; else img.style.opacity = j;
   setTimeout("fadeOutExec(\""+e+"\", "+(Math.round((j-0.1)*10)/10)+", true)", waitFrame);
  } else {
   lock[e] = false; // Unlock
   if (state[e]) fadeIn(e) // Verifica Estado
  }
 }
}