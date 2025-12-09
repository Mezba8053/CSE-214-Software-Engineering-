import java.util.Scanner;

//Abstract Factory 
interface BankFactory {
    Account createAccount(String name, double balance, double loan, int time);
    Loan createLoan(String name, double balance, double loan, int time);
}
//Concrete Factories
class RegularFactory implements BankFactory {
    public Account createAccount(String name, double balance, double loan, int time) {
        return new RegularAccount(name, balance, loan, time);
    }

    public Loan createLoan(String name, double balance, double loan, int time) {
        return new RegularLoan(name, balance, loan, time);
    }
}

class PremiumFactory implements BankFactory {
    public Account createAccount(String name, double balance, double loan, int time) {
        return new PremiumAccount(name, balance, loan, time);
    }

    public Loan createLoan(String name, double balance, double loan, int time) {
        return new PremiumLoan(name, balance, loan, time);
    }
}

class VIPFactory implements BankFactory {
    public Account createAccount(String name, double balance, double loan, int time) {
        return new VIPAccount(name, balance, loan, time);
    }

    public Loan createLoan(String name, double balance, double loan, int time) {
        return new VIPLoan(name, balance, loan, time);
    }
}

//Product Interface
interface Account {
    void performAccount();
}

interface Loan {
    void performLoan();
}

class Banksystem {
    String name;
    String type;
    double previous_amount;
    String operation;

    Banksystem(String n, String o, String t, double p) {
        name = n;
        operation = o;
        type = t;
        previous_amount = p;
    }

    public double interest(double rate, int time) {
        return previous_amount * rate * time;
    }

    public void display(double rate, double loan, int time, double interest) {
        System.out.println("Name: " + name);
        System.out.println("Previous Balance: " + previous_amount);
        System.out.println("Type: " + type);
        System.out.println("Operation: " + operation);
        System.out.println("Rate: " + (rate * 100) + "%");
        System.out.println("Loan Amount taken: " + loan);
        System.out.println("Time: " + time);
        System.out.println("Current Balance: " + (previous_amount + loan));
        System.out.println("Interest: " + interest);
    }
}
//Concrete Products
class RegularAccount extends Banksystem implements Account {
    double rate_account = 0.025;
    double loan;
    int time;

    RegularAccount(String n, double b, double l, int t) {
        super(n, "Accounts", "Regular", b);
        loan = l;
        time = t;
        performAccount();
    }

    @Override
    public void performAccount() {
        double interestAccount = interest(rate_account, time);
        display(rate_account, loan, time, interestAccount);
    }
}

class RegularLoan extends Banksystem implements Loan {
    double rate_loan = 0.14;
    double loan;
    int time;

    RegularLoan(String n, double b, double l, int t) {
        super(n, "Loan", "Regular", b);
        loan = l;
        time = t;
        performLoan();
    }

    @Override
    public void performLoan() {
        double interestLoan = interest(rate_loan, time);
        display(rate_loan, loan, time, interestLoan);
    }
}

class PremiumAccount extends Banksystem implements Account {
    double rate_account = 0.035;
    double loan;
    int time;

    PremiumAccount(String n, double b, double l, int t) {
        super(n, "Accounts", "Premium", b);
        loan = l;
        time = t;
        performAccount();
    }

    @Override
    public void performAccount() {
        double interestAccount = interest(rate_account, time);
        display(rate_account, loan, time, interestAccount);
    }
}

class PremiumLoan extends Banksystem implements Loan {
    double rate_loan = 0.12;
    double loan;
    int time;

    PremiumLoan(String n, double b, double l, int t) {
        super(n, "Loan", "Premium", b);
        loan = l;
        time = t;
        performLoan();
    }

    @Override
    public void performLoan() {
        double interestLoan = interest(rate_loan, time);
        display(rate_loan, loan, time, interestLoan);
    }
}
class VIPAccount extends Banksystem implements Account {
    double rate_account = 0.05;
    double loan;
    int time;

    VIPAccount(String n, double b, double l, int t) {
        super(n, "Accounts", "VIP", b);
        loan = l;
        time = t;
        performAccount();
    }

    @Override
    public void performAccount() {
        double interestAccount = interest(rate_account, time);
        display(rate_account, loan, time, interestAccount);
    }
}

class VIPLoan extends Banksystem implements Loan {
    double rate_loan = 0.10;
    double loan;
    int time;

    VIPLoan(String n, double b, double l, int t) {
        super(n, "Loan", "VIP", b);
        loan = l;
        time = t;
        performLoan();
    }

    @Override
    public void performLoan() {
        double interestLoan = interest(rate_loan, time);
        display(rate_loan, loan, time, interestLoan);
    }
}
class Client {
    private BankFactory factory;

    Client(String type) {
        switch (type) {
            case "Regular":
                factory = new RegularFactory();
                break;
            case "Premium":
                factory = new PremiumFactory();
                break;
            case "VIP":
                factory = new VIPFactory();
                break;
            default:
                throw new IllegalArgumentException("Invalid client type");
        }
    }

    public void makeOperation(int operationType, String name, double balance, double loan, int time) {
        if (operationType == 1) {
            Account account = factory.createAccount(name, balance, loan, time);
        } else if (operationType == 2) {
            Loan loanObj = factory.createLoan(name, balance, loan, time);
        }
    }
}


public class Customer{
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("Enter the name of the customer: ");
        String name = sc.nextLine();

        System.out.println("Account Type: 1. Regular 2. Premium 3. VIP");
        int type = sc.nextInt();

        System.out.println("Enter the balance: ");
        double balance = sc.nextDouble();

        System.out.println("Enter the loan amount: ");
        double loan = sc.nextDouble();

        System.out.println("Enter the time (years): ");
        int time = sc.nextInt();

        System.out.println("Operation Type: 1. Accounts 2. Loan");
        int operationType = sc.nextInt();

       Client factory = null;

        switch (type) {
            case 1:
                factory = new Client("Regular");
                break;
            case 2:
                factory = new Client("Premium");
                break;
            case 3:
                factory = new Client("VIP");
                break;
            default:
                System.out.println("Invalid customer type.");
                System.exit(0);
        }

        if (operationType == 1) {
           factory.makeOperation(operationType,name, balance, loan, time);
        } else if (operationType == 2) {
           factory.makeOperation(operationType,name, balance, loan, time);
        } else {
            System.out.println("Invalid operation type.");
        }

        sc.close();
    }
}
