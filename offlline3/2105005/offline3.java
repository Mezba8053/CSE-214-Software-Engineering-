import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

class Movie {
    String movieName;
    float rating;

    Movie(String name, float rating2) {
            this.movieName = name;
            this.rating = rating2;
    }
    public String getMovieName()
    {
        return this.movieName;
    }
    public float getRating()
    {
        return this.rating;
    }
}

interface Subject {
    void notifyObserver(String gen,Movie movie);
    void registerObserver(Observer o);
}

interface Observer {
    void update(Movie movie);
    String getGenreName();
    void updateGenre(String genreName,GenreDetails genreDetails);
}

class GenreDetails {
    Map<String, List<Movie>> genreMap = new HashMap<>();

    void addMovie(String genreName, Movie m) {
        genreMap.computeIfAbsent(genreName, k -> new ArrayList<>()).add(m);
    }

    void removeMovie(String genreName, Movie m) {
        if (genreMap.containsKey(genreName)) {
            genreMap.get(genreName).remove(m);
        }
    }

    List<Movie> getMovies(String genreName) {
        return genreMap.getOrDefault(genreName, new ArrayList<>());
    }
}

class ConcreteObserver implements Observer {
    private String name;
    private String genreName;
    private GenreDetails genreDetails;

    public ConcreteObserver(String name, String genreName, GenreDetails genreDetails) {
        this.name = name;
        this.genreName = genreName;
        this.genreDetails = genreDetails;
    }
    @Override
    public void updateGenre(String genreName,GenreDetails genreDetails)
    {
        this.genreName=genreName;
        this.genreDetails=genreDetails;
    }
    
    @Override
    public void update(Movie movie) {
        display(movie);
        // System.out.println("Observer: " + name);
        // System.out.println("Genre: " + genreName);
        // System.out.println("Movie Updated: " + movie.getMovieName() + ", Rating: " + movie.getRating());
    }

    @Override
    public String getGenreName() {
        return this.genreName;
    }

    public void display(Movie movie) {
        // System.out.println("Observer: " + name);
        // System.out.println("Genre: " + genreName);
        // System.out.println("Movie Updated: " + movie.getMovieName() + ", Rating: " + movie.getRating());
        System.out.println("Observer: " + name+" Genre: "+genreName+" Movie Updated: " + movie.getMovieName() + ", Rating: " + movie.getRating());
    }

    public void details() {
        System.out.println("Observer: " + name);
        System.out.println("Genre: " + genreName);
        List<Movie> movies = genreDetails.getMovies(genreName); // Get movies from shared GenreDetails
        for (Movie m : movies) {
            System.out.println("Movie: " + m.getMovieName() + ", Rating: " + m.getRating());
        }
    }
}


class ConcreteSubject implements Subject {
    private List<Observer> observers = new ArrayList<>();
   // private Movie movie;
    GenreDetails genDetails=new GenreDetails();
    public void addMovies(String gen, Movie movie) {
        genDetails.addMovie(gen, movie);
        List<Thread> threads = new ArrayList<>();
        
        for (Observer o : observers) {
            if (o.getGenreName().equals(gen)) {
                Thread t = new Thread(() -> {
                    o.update(movie);
                });
                threads.add(t);
                t.start();
            }
        }
        
        for (Thread t : threads) {
            try {
                t.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public void notifyObserver(String gen, Movie movie) {
        List<Thread> threads = new ArrayList<>();
        for (Observer o : observers) {
            if (o.getGenreName().equals(gen)) {
                Thread t = new Thread(() -> {
                    o.update(movie);
                });
                threads.add(t);
                t.start();
            }
        }
        
        for (Thread t : threads) {
            try {
                t.join();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
    public void registerObserver(Observer o) {
        observers.add(o);
    }

    
}



public class offline3 {
    public static void main(String[] args) {
        GenreDetails genreDetails = new GenreDetails();
        ConcreteSubject cs = new ConcreteSubject();

        try (BufferedReader br = new BufferedReader(new FileReader("input.txt"))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] details = line.replace("\"", "").split(",");

                if (details.length == 3) {
                    String genre = details[0].trim();
                    String movieName = details[1].trim();
                    float rating = Float.parseFloat(details[2].trim());

                    Movie movie = new Movie(movieName, rating);
                    genreDetails.addMovie(genre, movie);
                    cs.addMovies(genre, movie);
                }
            }

            System.out.println("Movies added successfully!");
        } catch (IOException e) {
            e.printStackTrace();
        } catch (NumberFormatException e) {
            System.out.println("Invalid rating format in the input file.");
            e.printStackTrace();
        }

        ConcreteObserver obs1 = new ConcreteObserver("Meza", "Thriller", genreDetails);
        ConcreteObserver obs2 = new ConcreteObserver("Intaj", "Thriller", genreDetails);
        cs.registerObserver(obs1);
        cs.registerObserver(obs2);
        Movie movie = new Movie("Incepta", 9);
        cs.addMovies("Thriller", movie);
        obs1.updateGenre("Comedy", genreDetails);

        Movie movie1 = new Movie("Inception", 9);
        cs.addMovies("Thriller", movie1);
        Movie movie2 = new Movie("Interstellar", 8);
        cs.addMovies("Comedy", movie2);

    
        // obs1.details();
        // obs2.details();
    }
}