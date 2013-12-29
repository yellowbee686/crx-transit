default:
	echo "Removing old package..."
	rm -f package/transit.zip
	echo "Making new package..."
	mkdir -p package
	cd transit && zip -r ../package/transit.zip * 
