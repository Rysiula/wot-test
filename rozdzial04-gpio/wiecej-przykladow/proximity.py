# Zaimportowanie plików nagłówkowych Pythona
import RPi.GPIO as GPIO
import time

# Ustawienie konwencji nazewniczej dla portów GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

# Set a variable to hold the GPIO Pin identity
# Ustawienie wartości przechowującej numer pinu
PinPIR = 17

print "Test modułu obsługi PIR (naciśnij CTRL-C by wyjść)"

# Ustawienie pinu w trybie odczytu
GPIO.setup(PinPIR, GPIO.IN)

# Zmienne przechowujące bieżący i poprzedni stan pinu
Current_State  = 0
Previous_State = 0

try:
  print "Czekam na ustalenie wartości czujnika PIR ..."
  # Pętla aż do momentu gdy wartością zwracaną przez czujnik PIR będzie 0
  while GPIO.input(PinPIR)==1:
    Current_State = 0

  print " Gotowe."
  while True:
    # Odczyt stanu czujnika PIR 
    Current_State = GPIO.input(PinPIR)

    # W razie wyzwolenie czujnika PIR 
    if Current_State==1 and Previous_State==0:
      print " Wykryto ruch!"
      # Zapis poprzedniego stanu czujnika
      Previous_State=1

    # Jeśli czujnik PIR wrócił do stanu gotowości
    elif Current_State==0 and Previous_State==1:
      print " Gotowy."
      Previous_State = 0
    
    # Oczekiwanie przez 10 milisekund
    time.sleep(0.01)

except KeyboardInterrupt:
  print " Koniec."
  
  # Przywrócenie początkowych ustawień portu GPIO 
  GPIO.cleanup()