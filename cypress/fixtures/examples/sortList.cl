Class List inherits IO {
	isNil() : Bool { { abort(); true; } };

	cons(hd : Int, teste: algo) : Cons {
	 (let new_cell : Cons <- new Cons in
		new_cell.init(hd,self)
	 )
	};

	car() : Int { { abort(); new Int; } };

	cdr() : List { { abort(); new List; } };

	rev() : List { cdr() };

	sort() : List { cdr() };

	insert(i : Int) : List { cdr() };

	rcons(i : Int) : List { cdr() };

	print_list() : Object { abort() };
};

Class Cons inherits List {
	xcar : Int;
	xcdr : List;

	isNil() : Bool { false };

	init(hd : Int, tl : List) : Cons {
	 {
	 xcar <- hd;
	 xcdr <- tl;
	 self;
	 }
	};

	car() : Int { xcar };

	cdr() : List { xcdr };

	rev() : List { (xcdr.rev()).rcons(xcar) };

	sort() : List { (xcdr.sort()).insert(xcar) };

	insert(i : Int) : List {
		if i < xcar then
			(new Cons).init(i,self)
		else
			(new Cons).init(xcar,xcdr.insert(i))
		fi
	};


	rcons(i : Int) : List { (new Cons).init(xcar, xcdr.rcons(i)) };

	print_list() : Object {
		{
		 out_int(xcar);
		 out_string("\n");
		 xcdr.print_list();
		}
	};
};

Class Nil inherits List {
	isNil() : Bool { true };

 rev() : List { self };

	sort() : List { self };

	insert(i : Int) : List { rcons(i) };

	rcons(i : Int) : List { (new Cons).init(i,self) };

	print_list() : Object { true };

};


Class Main inherits IO {

	l : List;

	iota(i : Int) : List {
	 {
		l <- new Nil;
		(let j : Int <- 0 in
		 while j < i
		 loop
		 {
		 l <- (new Cons).init(j,l);
		 j <- j + 1;
		 }
		 pool
		);
		l;
	 }
	};

	main() : Object {
	 {
	 out_string("How many numbers to sort? ");
	 iota(in_int()).rev().sort().print_list();
	 }
	};
};





