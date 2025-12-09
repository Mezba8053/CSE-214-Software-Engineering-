
import java.util.Scanner;

class Package {
    String packageName;
    private MicroControllerFactory microController;
    private displayfactory display;
    private ticketing_cardfactory ticketing_card;
    private payment_terminalfactory payment_terminal;
    private String internet_connection;
    private storagefactory storage;
    private controllerfactory controller;
    private String webServer;

    Package() {
        this.microController = null;
        this.display = null;
        this.ticketing_card = null;
        this.payment_terminal = null;
        this.internet_connection = "";
        this.storage = null;
        this.controller = null;
        this.webServer = "";
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public void setMicroController(MicroControllerFactory microController) {
        this.microController = microController;
    }

    public void setDisplay(displayfactory display) {
        this.display = display;
    }

    public void setTicketingCard(ticketing_cardfactory ticketing_card) {
        this.ticketing_card = ticketing_card;
    }

    public void setPaymentTerminal(payment_terminalfactory payment_terminal) {
        this.payment_terminal = payment_terminal;
    }

    public void setInternetConnection(String internet_connection) {
        this.internet_connection = internet_connection;
        System.out.println(internet_connection);
    }

    public void setStorage(storagefactory storage) {
        this.storage = storage;
    }

    public void setController(controllerfactory controller) {
        this.controller = controller;
    }

    public void setWebServer(String web_server) {
        this.webServer = web_server;
    }



    public void details() {
        System.out.println("Package Name: " + packageName);
        System.out.println("MicroController: " + microController.getMicroController());
        System.out.println("Display: " + display.getdisplay());
        System.out.println("Ticketing Card: " + ticketing_card.getticketing_card());
        System.out.println("Payment Terminal: " + payment_terminal.getpayment_terminal());
        System.out.println("Internet Connection: " + internet_connection);
        System.out.println("Storage: " + storage.getstorage());
        System.out.println("Controller: " + controller.getcontroller());
        System.out.println("Web Server: " +webServer);
    }
    @Override
    public String toString() {
        return "Package Name: " + packageName + "\n" +
               "MicroController: " + microController.getMicroController() + "\n" +
               "Display: " + display.getdisplay() + "\n" +
               "Ticketing Card: " + ticketing_card.getticketing_card() + "\n" +
               "Payment Terminal: " + payment_terminal.getpayment_terminal() + "\n" +
               "Internet Connection: " + internet_connection + "\n" +
               "Storage: " + storage.getstorage() + "\n" +
               "Controller: " + controller.getcontroller() + "\n" +
               "Web Server: " + webServer;
    }
    
}

interface Builder {
    void addName(String name);
    void buildMicroController(MicroControllerFactory microController);
    void buildDisplay(displayfactory display);
    void buildTicketingCard(ticketing_cardfactory ticketing_card);
    void buildPaymentTerminal(payment_terminalfactory payment_terminal);
    void buildInternetConnection(internet_connectionfactory internet_connection);
    void buildStorage(storagefactory storage);
    void buildController(controllerfactory controller);
    void buildWebServer(WebServerFactory webServerFactory);
    Package getPackage();


    void PackageDetails();
}

class MrtBuilder implements Builder {
    private Package pack;

    MrtBuilder() {
        pack = new Package();
    }

    public void addName(String name) {
        pack.setPackageName(name);
    }

    public void buildMicroController(MicroControllerFactory microController) {
        pack.setMicroController(microController);
        microController.addMicroController();
    }
    public void buildInternetConnection(internet_connectionfactory internet_connection) {
        pack.setInternetConnection(internet_connection.getinternet_connection());
        //  internet_connection.addinternet_connection();
    }

    public void buildDisplay(displayfactory display) {
        pack.setDisplay(display);
        display.adddisplay();
    }

    public void buildTicketingCard(ticketing_cardfactory ticketing_card) {
        pack.setTicketingCard(ticketing_card);
        ticketing_card.addticketing_card();
    }

    public void buildPaymentTerminal(payment_terminalfactory payment_terminal) {
        pack.setPaymentTerminal(payment_terminal);
        payment_terminal.addpayment_terminal();
    }

    public void buildStorage(storagefactory storage) {
        pack.setStorage(storage);
        storage.addstorage();
    }

    public void buildController(controllerfactory controller) {
        pack.setController(controller);
        controller.addcontroller();
    }

    public   void buildWebServer(WebServerFactory webServerFactory) {
        pack.setWebServer(webServerFactory.getweb_server());
        // System.out.println(webServerFactory.getweb_server());
        //  web_server.addweb_server();
    }

    public void PackageDetails() {
        pack.details();
    }
    public Package getPackage()
    {
        return pack;
    }
}

class MRT_Director {
    private Builder builder;

    public MRT_Director(Builder builder) {
        this.builder = builder;
    }

    public Package construct(int type) {
        switch (type) {
            case 1:
                builder.addName("Basic");
                builder.buildMicroController(new ATMega32());
                builder.buildDisplay(new LCDDisplay());
                builder.buildTicketingCard(new RFIDCard());
                builder.buildPaymentTerminal(new payment_terminalfactory());
                builder.buildStorage(new SD());
                builder.buildController(new controllerfactory());
                break;
            case 2:
                builder.addName("Standard");
                builder.buildMicroController(new Arduino());
                builder.buildDisplay(new LEDDisplay());
                builder.buildTicketingCard(new RFIDCard());
                builder.buildPaymentTerminal(new payment_terminalfactory());
                builder.buildStorage(new SD());
                builder.buildController(new controllerfactory());
                break;
            case 3:
                builder.addName("Advanced");
                builder.buildMicroController(new RaspberryPi());
                builder.buildDisplay(new OLEDDisplay());
                builder.buildTicketingCard(new NFCCard());
                builder.buildPaymentTerminal(new payment_terminalfactory());
                builder.buildStorage(new Storage());
                builder.buildController(new controllerfactory());
                break;
            case 4:
                builder.addName("Premium");
                builder.buildMicroController(new RaspberryPi());
                builder.buildDisplay(new touchscreendisplay());
                builder.buildTicketingCard(new NFCCard());
                builder.buildPaymentTerminal(new payment_terminalfactory());
                builder.buildStorage(new Storage());
                builder.buildController(new controllerfactory());
                break;
            default:
                System.out.println("Invalid Selection");
                return null;
        }
        return builder.getPackage();
    }
}

interface MicroControllerFactory {
    void addMicroController();
    String getMicroController();
}

class ATMega32 implements MicroControllerFactory {
    public void addMicroController() {
        System.out.println("ATMega32 is built");
    }

    public String getMicroController() {
        return "ATMega32";
    }
}

class Arduino implements MicroControllerFactory {
    public void addMicroController() {
        System.out.println("Arduino is built");
    }

    public String getMicroController() {
        return "Arduino";
    }
}

class RaspberryPi implements MicroControllerFactory {
    public void addMicroController() {
        System.out.println("Raspberry Pi is built");
    }

    public String getMicroController() {
        return "Raspberry Pi";
    }
}

interface displayfactory {
    void adddisplay();
    String getdisplay();
}

class touchscreendisplay implements displayfactory {
    public void adddisplay() {
        System.out.println("Touch Screen Display is built");
    }

    public String getdisplay() {
        return "Touch Screen Display";
    }
}

class LEDDisplay implements displayfactory {
    public void adddisplay() {
        System.out.println("LED Display is built");
    }

    public String getdisplay() {
        return "LED Display";
    }
}

class LCDDisplay implements displayfactory {
    public void adddisplay() {
        System.out.println("LCD Display is built");
    }

    public String getdisplay() {
        return "LCD Display";
    }
}

class OLEDDisplay implements displayfactory {
    public void adddisplay() {
        System.out.println("OLED Display is built");
    }

    public String getdisplay() {
        return "OLED Display";
    }
}

interface ticketing_cardfactory {
    void addticketing_card();
    String getticketing_card();
}

class RFIDCard implements ticketing_cardfactory {
    public void addticketing_card() {
        System.out.println("RFID Card is built");
    }

    public String getticketing_card() {
        return "RFID Card";
    }
}

class NFCCard implements ticketing_cardfactory {
    public void addticketing_card() {
        System.out.println("NFC Card is built");
    }

    public String getticketing_card() {
        return "NFC Card";
    }
}

class payment_terminalfactory {
    public void addpayment_terminal() {
        System.out.println("Payment Terminal is built");
    }

    public String getpayment_terminal() {
        return "Payment Terminal";
    }
}
//abstract factory
interface InternetConnectionFactory {
    internet_connectionfactory createInternetConnection();
}
//product interface
interface internet_connectionfactory {
    void addinternet_connection();
    String getinternet_connection();
}
//Concrete Factories
class WiFiFactory implements InternetConnectionFactory {
    @Override
    public internet_connectionfactory createInternetConnection() {
        return new WiFi();
    }
}

class GSMFactory implements InternetConnectionFactory {
    @Override
    public internet_connectionfactory createInternetConnection() {
        return new GSM();
    }
}

class EthernetFactory implements InternetConnectionFactory {
    @Override
    public internet_connectionfactory createInternetConnection() {
        return new Ethernet();
    }
}

class WiFi implements internet_connectionfactory {
    @Override
    public void addinternet_connection() {
        System.out.println("WiFi is built");
    }

    @Override
    public String getinternet_connection() {
        return "WiFi";
    }

}

class GSM implements internet_connectionfactory {
    @Override
    public void addinternet_connection() {
        System.out.println("GSM is built");
    }

    @Override
    public String getinternet_connection() {
        return "GSM";
    }
}

class Ethernet implements internet_connectionfactory {
    @Override
    public void addinternet_connection() {
        System.out.println("Ethernet is built");
    }

    @Override
    public String getinternet_connection() {
        return "Ethernet";
    }
}

interface storagefactory {
    void addstorage();
    String getstorage();
}

class Storage implements storagefactory {
    public void addstorage() {
        System.out.println("Storage is built");
    }

    public String getstorage() {
        return "storage will be provided along with";
    }
}

class SD implements storagefactory {
    public void addstorage() {

        System.out.println("SD is built");
    }

    public String getstorage() {
        return "SD";
    }
}

class controllerfactory {
    public void addcontroller() {
        System.out.println("Controller is built");
    }

    public String getcontroller() {
        return "Controller";
    }
}

interface web_serverfactory {
    WebServerFactory createWebServer();
}

interface WebServerFactory {
    void addweb_server();
    String getweb_server();
}

class DjangoFactory implements web_serverfactory {
    @Override
    public WebServerFactory createWebServer() {
        return new Django();
    }
}

class RubyFactory implements web_serverfactory {
    @Override
    public WebServerFactory createWebServer() {
        return new Ruby();
    }
}

class NodeJSFactory implements web_serverfactory {
    @Override
    public WebServerFactory createWebServer() {
        return new NodeJS();
    }
}

class Django implements WebServerFactory {
    public void addweb_server() {
        System.out.println("Django is built");
    }

    public String getweb_server() {
        return "Django";
    }
}

class Ruby implements WebServerFactory {
    public void addweb_server() {
        System.out.println("Ruby is built");
    }

    public String getweb_server() {
        return "Ruby";
    }
}

class NodeJS implements WebServerFactory {
    public void addweb_server() {
        System.out.println("NodeJS is built");
    }

    public String getweb_server() {
        return "NodeJS";
    }
}

public class MRT
{

    public static void main(String args[])

    {   MrtBuilder builder = new MrtBuilder();
        MRT_Director director = new MRT_Director(builder);
        Scanner sc = new Scanner(System.in);
        System.out.println("Welcome to MRT System");
        System.out.println();
        System.out.println("Package System  :" );
        System.out.println();
        System.out.println("Press 1 for     Basic , 2 for Standard , 3 for Advanced and 4 for Premium" );
        int type=sc.nextInt();

        switch(type)
        {
            case 1:
                System.out.println("Basic Package Selected");
                director.construct(type);
                break;
            case 2:
                System.out.println("Standard Package Selected");
                director.construct(type);

                break;
            case 3:
                System.out.println("Advanced Package Selected");
                director.construct(type);

                break;
            case 4:
                System.out.println("Premium Package Selected");
                director.construct(type);

                break;
            default:
                System.out.println("Invalid Selection");
                break;
        }
        System.out.println("Press 1 for WiFi , 2 for GSM and 3 for Ethernet:" );
        int type1=sc.nextInt();
        switch(type1)
        {
            case 1:
                // internet_connectionfactory internet_connection=new WiFiFactory().createInternetConnection();

                System.out.println("WiFi is built");
                WiFiFactory wifiFactory = new WiFiFactory();
                builder.buildInternetConnection(wifiFactory.createInternetConnection());
                break;
            case 2:
                System.out.println("GSM is built");
                GSMFactory gsmFactory = new GSMFactory();
                builder.buildInternetConnection(gsmFactory.createInternetConnection());
                break;
            case 3:
                System.out.println("Ethernet is built");
                EthernetFactory ethernetFactory = new EthernetFactory();
                builder.buildInternetConnection(ethernetFactory.createInternetConnection());
                break;
            default:
                System.out.println("Invalid Selection");
                break;
        }
        System.out.println("Press 1 for Django , 2 for Ruby , 3 for NodeJS" );
        int type2=sc.nextInt();
        switch(type2)
        {
            case 1:
                System.out.println("Django is built");
                DjangoFactory djangoFactory = new DjangoFactory();

            builder.buildWebServer( djangoFactory.createWebServer());        
              break;
            case 2:
                System.out.println("NodeJS is built");
                NodeJSFactory nodeJSFactory = new NodeJSFactory();
                nodeJSFactory.createWebServer();
                builder.buildWebServer(nodeJSFactory.createWebServer());
                break;
            case 3:
                System.out.println("Ruby is built");
                RubyFactory rubyFactory = new RubyFactory();
                builder.buildWebServer(rubyFactory.createWebServer());

                break;
            default:
                System.out.println("Invalid Selection");
                break;
        }
        System.out.println("Press 1 for Details and 2 for Exit...");
        int type3=sc.nextInt();
        switch(type3)
        {
            case 1:
                System.out.println(builder.getPackage().toString());
                ;
                break;
            case 2:
                System.out.println("Exiting.....");
                break;
            default:
                System.out.println("Invalid Choice");
                break;




        }

    }
}
