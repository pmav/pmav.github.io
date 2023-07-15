# ####################################### #### ### ## #
# Netvisão Checker
# 1.5.1  - 18/Jun/2006
# 1.5.1c - 13/Ago/2006
# 1.5.2  - 22/Set/2006 (Suporte para mais que um modem)
# 1.5.2a - 13/Jan/2007 (#BUG: Trim do output)
# 1.5.2b - 03/Mar/2007 (Mudanças no HTML da página)
# 1.5.2c - 03/Mai/2007 (Mudanças no HTML da página)
# 1.5.2d - 29/Jun/2007 (Mudanças no HTML da página)
# 1.5.2e - 24/Nov/2007 (Mudanças no HTML da página)
#
# http://pmav.eu/stuff/netvisao-checker/
# ####################################### #### ### ## #


require "rubyscript2exe"
require "net/http"


HOST      = "clientes.cabovisao.pt"
PORT      = 80
PATH_L    = "/index_main.php"
PATH_S    = "/internetx_modem_statistics.php"
REFERER   = "http://clientes.cabovisao.pt/index_main.php"
USERAGENT = "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.4) Gecko/20070515 Firefox/2.0.0.4"
TIMEOUT   = 15




def main
 system("cls")
 if ARGV.length < 2
  puts "sintaxe: "+File.basename(RUBYSCRIPT2EXE::APPEXE)+" <numero_cliente> <password>"
  pressKey
 end
 
 ncliente = ARGV[0].to_s
 password = ARGV[1].to_s


 ### Init Connection
 begin
  http = Net::HTTP.start(HOST, PORT)
  http.read_timeout = TIMEOUT
 rescue
  pressKey "Erro ao conectar a "+HOST+":"+PORT.to_s
 end
 
 
 begin
  ### Cookie
  r = http.get2(PATH_L, {'User-Agent' => USERAGENT})
  cookie = r.response['set-cookie']
  unless cookie.empty?
   puts "Cookie: OK"
  else
   pressKey "Cookie: Falhou"
  end
  
  ### Login
  data = 'cn='+ncliente+'&client_password='+password+'&submit=Enviar+Dados&k=YbXdF&action=check_login'
  
  headers = {
   'cookie'       => cookie,
   'Referer'      => REFERER,
   'Content-Type' => 'application/x-www-form-urlencoded',
   'User-Agent'   => USERAGENT }
  
  print "Login.: "
  
  t1 = Thread.new do while true do sleep 0.5; print "." end end
  r = http.post2(PATH_L, data, headers)
  t1.kill
  
  if (!r.body.include?("Autenticação Inválida!"))
   puts "OK"
  else
   pressKey "Falhou"
  end
  
  ### Get Stats
  print "Stats.: "
  
  t2 = Thread.new do while true do sleep 0.5; print "." end end
  r = http.get2(PATH_S, headers)
  t2.kill
  
  if r.body.include? "Tráfego"
   puts "OK"
   parsing r.body
  else
   pressKey "Falhou"
  end
  
  http.finish
  pressKey
  
 rescue TimeoutError
  pressKey " Erro: timeout (#{TIMEOUT}s)"
 end
end



def parsing (body)
 inline = 0
 separator = false
 body.each do |line|
  if inline == 0
   inline = 1 if line.strip == "<td>&nbsp;&nbsp;&nbsp;<b>Tráfego</b></td>"
  else
  
   if separator
    puts "\n\n\n"
    separator = false
   end
	
   if inline < 57
    case inline
     when  3: puts "\nEquipamento...: "+clean(line)+"\n\n"
     when  5: puts "Utilizado.....: "+clean(line)+"\n\n"
     when 12: puts "Ultima Leitura: "+clean(line)+"\n\n" 
     when 14: puts "Limite........: "+clean(line)+"\n\n"
     when 44: puts "Percentagem...: "+clean(line)
    end
    inline += 1
   else
    inline = 0
	   separator = true
   end

  end
 end
end



def clean (str)
 return str.gsub(/(&nbsp;)|(<\/td>)|(<td>)|(&nbsp)|(<td align="center">)/, "").gsub("Gigabytes", " GB").strip
end



def pressKey (str="")
 unless str.empty?: puts str end
 printf("\nHit Return to leave...")
 $stdin.gets
 exit
end



main