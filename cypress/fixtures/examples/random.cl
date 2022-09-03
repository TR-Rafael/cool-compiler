(*
    Generates random numbers between a provided minimum and
    maximum for a given seed

    Written by Nathan Friend in May, 2015
*)

class Utility {
    modulo(num: Int, mod: Int): Int {
        num - (num / mod) * mod
    };
};

class Random {
    a: Int <- 1103515245;
    c: Int <- 12345;
    m: Int <- 2147483648;
    last: Int <- 1;
    util: Utility <- new Utility;

    setSeed(seed: Int): Int {
        last <- seed
    };

    next(): Int {
        last <- util.modulo(last * a + c, m) / 32
    };

    -- min: inclusive minimum
    -- max: exclusive maximum
    nextBetween(min: Int, max: Int): Int {{
        if max - min < 1 then
        	abort()
        else
        	"do nothing"
        fi;
        last <- util.modulo(last * a + c, m) / 32;
        util.modulo(last, max - min) + min;
    }};
};

class Main inherits IO {
    main() : Object {
        let i: Int,
        	rand: Random <- new Random,
        	util: Utility <- new Utility,
        	min: Int <- 1,
        	max: Int <- 0,
        	a: A2I <- new A2I
        in {
            out_string("Enter a number to use as a random seed:\n");
            rand.setSeed(in_int());
            while not min < max loop {
                out_string("Minimum number (inclusive):\n");
                min <- in_int();
                out_string("Maximum number (exclusive):\n");
                max <- in_int();
                if not min < max then
                	out_string("Maximum must be greater than minimum.  Please try again.\n")
                else
                	self
                fi;
            } pool;
            out_string("Random numbers between ".concat(a.i2a(min).concat(" and ".concat(a.i2a(max).concat(":\n")))));
        	while i < 100 loop {
                out_string(a.i2a(rand.nextBetween(min, max)));
                if util.modulo(i + 1, 10) = 0 then
                	out_string("\n")
                else
                	out_string(", ")
                fi;
                i <- i + 1;
            } pool;
        }
    };
};

class A2I {

     c2i(char : String) : Int {
        if char = "0" then 0 else
        if char = "1" then 1 else
        if char = "2" then 2 else
        if char = "3" then 3 else
        if char = "4" then 4 else
        if char = "5" then 5 else
        if char = "6" then 6 else
        if char = "7" then 7 else
        if char = "8" then 8 else
        if char = "9" then 9 else
        { abort(); 0; }  (* the 0 is needed to satisfy the
                                  typchecker *)
        fi fi fi fi fi fi fi fi fi fi
     };

(*
   i2c is the inverse of c2i.
*)
     i2c(i : Int) : String {
        if i = 0 then "0" else
        if i = 1 then "1" else
        if i = 2 then "2" else
        if i = 3 then "3" else
        if i = 4 then "4" else
        if i = 5 then "5" else
        if i = 6 then "6" else
        if i = 7 then "7" else
        if i = 8 then "8" else
        if i = 9 then "9" else
        { abort(); ""; }  -- the "" is needed to satisfy the typchecker
        fi fi fi fi fi fi fi fi fi fi
     };

(*
   a2i converts an ASCII string into an integer.  The empty string
is converted to 0.  Signed and unsigned strings are handled.  The
method aborts if the string does not represent an integer.  Very
long strings of digits produce strange answers because of arithmetic
overflow.

*)
     a2i(s : String) : Int {
        if s.length() = 0 then 0 else
        if s.substr(0,1) = "-" then ~a2i_aux(s.substr(1,s.length()-1)) else
        if s.substr(0,1) = "+" then a2i_aux(s.substr(1,s.length()-1)) else
           a2i_aux(s)
        fi fi fi
     };

(* a2i_aux converts the usigned portion of the string.  As a
   programming example, this method is written iteratively.  *)


     a2i_aux(s : String) : Int {
        (let int : Int <- 0 in
           {
               (let j : Int <- s.length() in
                  (let i : Int <- 0 in
                    while i < j loop
                        {
                            int <- int * 10 + c2i(s.substr(i,1));
                            i <- i + 1;
                        }
                    pool
                  )
               );
              int;
            }
        )
     };

(* i2a converts an integer to a string.  Positive and negative
   numbers are handled correctly.  *)

    i2a(i : Int) : String {
        if i = 0 then "0" else
        if 0 < i then i2a_aux(i) else
          "-".concat(i2a_aux(i * ~1))
        fi fi
    };

(* i2a_aux is an example using recursion.  *)

    i2a_aux(i : Int) : String {
        if i = 0 then "" else
            (let next : Int <- i / 10 in
                i2a_aux(next).concat(i2c(i - next * 10))
            )
        fi
    };

};