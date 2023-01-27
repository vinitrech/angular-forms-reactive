import {Component, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signupForm: FormGroup;
  forbiddenUsernames: string[] = ['admin', 'root']

  ngOnInit() {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.validateUsername.bind(this)]), // the bind guarantees that the function will execute with the right context, in this case 'this' will reference the class. Without the bind, 'this' would be the something else.
        'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails)
      }),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([])
    });

    this.signupForm.valueChanges.subscribe((value) => { // fired when any value is changed
      console.log(value);
    });

    this.signupForm.statusChanges.subscribe((status) => { // fired when any status is changed (valid, invalid, pending)
      console.log(status);
    });

    this.signupForm.setValue({ // populate form with values, setValue needs the whole object to update
      'userData': {
        'username': "username",
        'email': "email@email.com"
      },
      'gender': "male",
      'hobbies': []
    });

    this.signupForm.patchValue({ // update single fields
      'userData': {
        'username': 'usernameTest'
      }
    })
  }

  onSubmit() {
    console.log(this.signupForm);
    this.signupForm.reset({
      'gender': 'female'
    });
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(control);
  }

  getControls() {
    return (<FormArray>this.signupForm.get('hobbies')).controls;
  }

  validateUsername(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenUsernames.indexOf(control.value) !== -1) { // indexOf return -1 if the element is not found
      return {'forbiddenUsername': true}
    }

    return null; // validation successful must return nothing or null
  }

  forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({'forbiddenEmail': true}); // fails validation
        } else {
          resolve(null); // pass validation
        }
      }, 1500);
    });
  }
}
