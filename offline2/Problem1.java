import java.util.*;

interface Menu {
        int discountedPrice = 0;
        String getName();
        int getPrice();
        void display();
        void setFree(String name);
    }
    
    class Food implements Menu {
        String name;
        int price;
        boolean isFree = false;
    
        Food(String name, int price) {
            this.name = name;
            this.price = price;
        }
    
        public String getName() {
            return name;
        }
    
        public int getPrice() {
            return isFree ? 0 : price;
        }
    
        public void display() {
            System.out.println(name + " - " + (isFree ? "Free" : price + "tk"));
        }
    
        public void setFree(String name) {
            if (this.name.equals(name)) {
                isFree = true;
            }
        }
    }
    
    class Composite implements Menu {
        String name;
        int basePrice; 
        int discount = 0;
        int discountedPrice = 0;
        List<Menu> menuList = new ArrayList<>();
        List<String> freeList = new ArrayList<>();
    
        Composite(String name, int basePrice) {
            this.name = name;
            this.basePrice = basePrice;
        }
    
        public void add(Menu menu) {
            menuList.add(menu);
        }
    
        public void remove(String itemName) {
            menuList.removeIf(menu -> menu.getName().equals(itemName));
        }
    
        public void setDiscount(int percentage) {
            discount = percentage;
        }
    
        public void setFree(String name) {
            freeList.add(name);
            for (Menu menu : menuList) {
                menu.setFree(name);
            }
        }
    
        public void display() {
            System.out.println(name);
            for (Menu menu : menuList) {
                System.out.println("- " + menu.getName());  
            }
            for (String freeItem : freeList) {
                System.out.println("- " + freeItem + " (Free!!!)");
            }
            int total = calculateTotalPrice();
            int discountedTotal = total - (total * discount / 100);
            System.out.println("Total before discount: " + total + "tk");
            System.out.println("Discount-" + discount + "%");
            System.out.println("Discounted Total-" + discountedTotal + "tk");
        }
    
        public String getName() {
            return name;
        }
    
       
        public int getPrice() {
            return basePrice;
        }
    
        public int calculateTotalPrice() {
            int totalPrice = basePrice; 
            for (Menu menu : menuList) {
                totalPrice += menu.getPrice();
            }
            basePrice=totalPrice;
              //basePrice=total - (total * discount / 100);
            return totalPrice;
        }
    }
    

public class Problem1 {
    private static Map<String, Menu> menuMap = new HashMap<>();

    private static void initializeMenu() {
        menuMap.put("Burger", new Food("Burger", 300));
        menuMap.put("Fries", new Food("Fries", 100));
        menuMap.put("Wedges", new Food("Wedges", 150));
        menuMap.put("Shawarma", new Food("Shawarma", 200));
        menuMap.put("Drink", new Food("Drink", 25));
    
        Composite combo1 = new Composite("Combo1", 400);
        combo1.add(menuMap.get("Burger"));
        combo1.add(menuMap.get("Fries"));
        combo1.add(menuMap.get("Drink"));
        menuMap.put("Combo1", combo1);
    
        Composite combo2 = new Composite("Combo2", 215);
        combo2.add(menuMap.get("Shawarma"));
        combo2.add(menuMap.get("Drink"));
        menuMap.put("Combo2", combo2);
    
       
        System.out.println("Menu:");
        System.out.println("Burger - 300tk");
        System.out.println("Fries - 100tk");
        System.out.println("Wedges - 150tk");
        System.out.println("Shawarma - 200tk");
        System.out.println("Drink - 25tk");
        System.out.println("Combo1 (Burger + Fries + Drink) - 400tk");
        System.out.println("Combo2 (Shawarma + Drink) - 215tk");
    }
    

    public static void main(String[] args) {
        initializeMenu();
        Scanner scan = new Scanner(System.in);

        int type = -1;

        while (type != 0) {
            System.out.println("Press 1 to create a combo, 2 to view menu, and 0 to exit");
            type = scan.nextInt();
            scan.nextLine();

            switch (type) {
                case 1:
                    System.out.println("Enter the name of the combo:");
                    String comboName = scan.nextLine();
                    Composite combo = new Composite(comboName,0);

                    System.out.println("Available commands:");
                    System.out.println("Add [item]");
                    System.out.println("Remove [item]");
                    System.out.println("Free [item]");
                    System.out.println("Discount [percentage]");
                    System.out.println("Done");

                    String command = "";
                    while (!command.equals("Done")) {
                        command = scan.nextLine();
                        String[] commandArray = command.split(" ");

                        if (commandArray[0].equals("Add")) {
                            Menu item = menuMap.get(commandArray[1]);
                            if (item != null) {
                                // System.out.println(item.getName()+" "+item.getPrice());
                                combo.add(item);
                            } else {
                                System.out.println("Item not found.");
                            }
                        } else if (commandArray[0].equals("Remove")) {
                            combo.remove(commandArray[1]);
                        } else if (commandArray[0].equals("Free")) {
                            combo.setFree(commandArray[1]);
                        } else if (commandArray[0].equals("Discount")) {
                            int percentage = Integer.parseInt(commandArray[1]);
                            combo.setDiscount(percentage);
                        } else if (command.equals("Done")) {
                            combo.display();
                            menuMap.put(comboName, combo);
                        } else {
                            System.out.println("Invalid command");
                        }
                    }
                    break;

                case 2:
                    System.out.println("Menu:");
                    for (String itemName : menuMap.keySet()) {
                        System.out.println(itemName + " - "+menuMap.get(itemName).getPrice()+"tk");
                        
                    }
                    break;

                case 0:
                    System.out.println("Exiting....");
                    break;

                default:
                    System.out.println("Invalid command");
                    break;
            }
        }
        scan.close();
    }
}
