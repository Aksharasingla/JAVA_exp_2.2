// ===== Part A: SumAutoboxing.java =====
// Demonstrates autoboxing, unboxing and parsing strings to integers.
import java.util.ArrayList;
import java.util.Scanner;

public class SumAutoboxing {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println("Enter integers separated by spaces (or press Enter for none):");
        String line = sc.nextLine().trim();

        ArrayList<Integer> list = new ArrayList<>(); // autoboxing will occur when adding ints

        if (!line.isEmpty()) {
            String[] tokens = line.split("\\s+");
            for (String t : tokens) {
                try {
                    // parse string to primitive int then autobox into Integer when added
                    Integer val = Integer.parseInt(t);
                    list.add(val); // autoboxing
                } catch (NumberFormatException e) {
                    System.out.println("Skipping invalid integer: '" + t + "'");
                }
            }
        }

        // Calculate sum using unboxing in enhanced for-loop
        int sum = 0;
        for (Integer number : list) {
            sum += number; // unboxing Integer -> int happens here
        }

        System.out.println("Numbers parsed: " + list);
        System.out.println("Sum (using autoboxing/unboxing): " + sum);

        sc.close();
    }
}


// ===== Part B: Student.java and StudentSerialization.java =====
// Student class used for serialization
import java.io.Serializable;

class Student implements Serializable {
    private static final long serialVersionUID = 1L;

    private String studentID;
    private String name;
    private double grade;

    public Student(String studentID, String name, double grade) {
        this.studentID = studentID;
        this.name = name;
        this.grade = grade;
    }

    public String getStudentID() { return studentID; }
    public String getName() { return name; }
    public double getGrade() { return grade; }

    @Override
    public String toString() {
        return "Student[ID=" + studentID + ", name=" + name + ", grade=" + grade + "]";
    }
}

// Program to serialize and deserialize a Student object
import java.io.*;

public class StudentSerialization {
    private static final String FILE = "student.ser";

    public static void main(String[] args) {
        Student s = new Student("S101", "Aarav Kumar", 8.75);

        // Serialize
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(FILE))) {
            oos.writeObject(s);
            System.out.println("Serialized student to " + FILE);
        } catch (IOException e) {
            System.err.println("Serialization error: " + e.getMessage());
            e.printStackTrace();
        }

        // Deserialize
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(FILE))) {
            Student read = (Student) ois.readObject();
            System.out.println("Deserialized student: " + read);
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Deserialization error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}


// ===== Part C: Employee.java and EmployeeManager.java =====
// Simple Employee class for serialization or text storage
import java.io.Serializable;

class Employee implements Serializable {
    private static final long serialVersionUID = 1L;

    private String id;
    private String name;
    private String designation;
    private double salary;

    public Employee(String id, String name, String designation, double salary) {
        this.id = id;
        this.name = name;
        this.designation = designation;
        this.salary = salary;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getDesignation() { return designation; }
    public double getSalary() { return salary; }

    @Override
    public String toString() {
        return String.format("ID: %s | Name: %s | Designation: %s | Salary: %.2f", id, name, designation, salary);
    }
}

// Menu-based employee manager using serialized ArrayList for persistence
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class EmployeeManager {
    private static final String FILE = "employees.dat";
    private List<Employee> employees;

    public EmployeeManager() {
        employees = loadEmployees();
    }

    @SuppressWarnings("unchecked")
    private List<Employee> loadEmployees() {
        File f = new File(FILE);
        if (!f.exists()) return new ArrayList<>();

        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(f))) {
            Object obj = ois.readObject();
            return (ArrayList<Employee>) obj;
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Could not load employees (starting new list): " + e.getMessage());
            return new ArrayList<>();
        }
    }

    private void saveEmployees() {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(FILE))) {
            oos.writeObject(new ArrayList<>(employees));
        } catch (IOException e) {
            System.err.println("Error saving employees: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void addEmployee(Scanner sc) {
        System.out.print("Enter Employee ID: ");
        String id = sc.nextLine().trim();
        System.out.print("Enter Name: ");
        String name = sc.nextLine().trim();
        System.out.print("Enter Designation: ");
        String desig = sc.nextLine().trim();
        System.out.print("Enter Salary: ");
        double salary = 0.0;
        try {
            salary = Double.parseDouble(sc.nextLine().trim());
        } catch (NumberFormatException e) {
            System.out.println("Invalid salary, set to 0.0");
        }

        Employee emp = new Employee(id, name, desig, salary);
        employees.add(emp);
        saveEmployees();
        System.out.println("Employee added and saved.");
    }

    private void displayEmployees() {
        if (employees.isEmpty()) {
            System.out.println("No employees found.");
            return;
        }
        System.out.println("--- Employee Records ---");
        for (Employee e : employees) System.out.println(e);
        System.out.println("------------------------");
    }

    public void run() {
        Scanner sc = new Scanner(System.in);
        while (true) {
            System.out.println("\nEmployee Management Menu:");
            System.out.println("1. Add an Employee");
            System.out.println("2. Display All Employees");
            System.out.println("3. Exit");
            System.out.print("Choose an option (1-3): ");

            String choice = sc.nextLine().trim();
            switch (choice) {
                case "1": addEmployee(sc); break;
                case "2": displayEmployees(); break;
                case "3": System.out.println("Exiting..."); sc.close(); return;
                default: System.out.println("Invalid option. Try again.");
            }
        }
    }

    public static void main(String[] args) {
        EmployeeManager mgr = new EmployeeManager();
        mgr.run();
    }
}


/*
Instructions to compile and run (from terminal):

1) Part A:
   Save SumAutoboxing.java
   javac SumAutoboxing.java
   java SumAutoboxing

2) Part B:
   Save Student.java and StudentSerialization.java (they are combined here for convenience in a single file;
   if you split them, ensure both are compiled).
   javac StudentSerialization.java
   java StudentSerialization

   This will create "student.ser" and then read it back.

3) Part C:
   Save Employee.java and EmployeeManager.java (or use the combined file provided).
   javac EmployeeManager.java
   java EmployeeManager

Notes:
- The EmployeeManager persists the full list to employees.dat by serializing an ArrayList<Employee>.
- If you prefer plain-text storage, swap serialization with BufferedWriter/FileReader and write/parse CSV-like lines.
*/
